/**
 * ERPNext REST API Client Service
 * Strictly integrated with ERPNext 'Project' and 'Task' DocTypes:
 * 
 * Project DocType Fields:
 * - name, project_name, status, priority, customer, project_type,
 *   expected_start_date, expected_end_date, percent_completed, _assign, creation
 * 
 * Task DocType Fields:
 * - name, subject, project, status, priority, exp_end_date,
 *   assigned_to, custom_category (or type), progress, creation
 */

export class ERPNextService {
  constructor(baseUrl, apiKey, apiSecret) {
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
    this.apiKey = apiKey || '';
    this.apiSecret = apiSecret || '';
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (this.apiKey && this.apiSecret) {
      headers['Authorization'] = `token ${this.apiKey}:${this.apiSecret}`;
    }
    return headers;
  }

  /**
   * Infer work category from task custom_category, type, or subject
   */
  inferCategory(task) {
    if (task.custom_category) return task.custom_category;
    if (task.category) return task.category;
    if (task.type) {
      const t = task.type.toLowerCase();
      if (t.includes('dev') || t.includes('backend') || t.includes('logic')) return 'Development';
      if (t.includes('ui') || t.includes('frontend') || t.includes('design') || t.includes('layout')) return 'UI';
      if (t.includes('migrat') || t.includes('import') || t.includes('schema') || t.includes('db')) return 'Migration';
      if (t.includes('test') || t.includes('qa') || t.includes('review') || t.includes('bug')) return 'Testing';
      if (t.includes('doc') || t.includes('manual') || t.includes('spec') || t.includes('wiki')) return 'Documentation';
    }

    const sub = (task.subject || '').toLowerCase();
    if (sub.includes('ui') || sub.includes('dashboard') || sub.includes('frontend') || sub.includes('screen') || sub.includes('kiosk') || sub.includes('portal')) return 'UI';
    if (sub.includes('migration') || sub.includes('migrate') || sub.includes('legacy') || sub.includes('ledger') || sub.includes('point of purchase')) return 'Migration';
    if (sub.includes('test') || sub.includes('qa') || sub.includes('stress') || sub.includes('bench') || sub.includes('compliance')) return 'Testing';
    if (sub.includes('doc') || sub.includes('manual') || sub.includes('whitepaper') || sub.includes('swagger') || sub.includes('spec')) return 'Documentation';
    return 'Development';
  }

  parseAssignees(assignField, defaultManager) {
    if (!assignField) {
      return defaultManager ? [{ name: defaultManager, email: '', avatar: defaultManager.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(), role: 'Manager' }] : [];
    }
    try {
      const parsed = typeof assignField === 'string' ? JSON.parse(assignField) : assignField;
      if (Array.isArray(parsed)) {
        return parsed.map(email => {
          const cleanName = email.split('@')[0].replace(/[._]/g, ' ');
          const name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          const avatar = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
          return { name, email, avatar, role: 'Team Member' };
        });
      }
    } catch {
      // fallback
    }
    return [{ name: String(assignField), email: '', avatar: 'US', role: 'Assignee' }];
  }

  /**
   * Test REST connection to ERPNext
   */
  async testConnection() {
    if (!this.baseUrl) {
      throw new Error("Base URL is empty");
    }
    try {
      const res = await fetch(`${this.baseUrl}/api/method/frappe.auth.get_logged_user`, {
        headers: this.getHeaders()
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return { success: true, user: data.message || 'Connected' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Fetch all projects from ERPNext REST API
   */
  async getProjects() {
    const query = new URLSearchParams({
      fields: JSON.stringify([
        "name", "project_name", "status", "priority", "customer", "project_type",
        "expected_start_date", "expected_end_date", "percent_completed",
        "company", "estimated_cost", "total_costing_amount", "_assign", "creation"
      ]),
      limit_page_length: 100,
      order_by: "creation desc"
    });

    const res = await fetch(`${this.baseUrl}/api/resource/Project?${query}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
    const data = await res.json();
    return (data.data || []).map(p => ({
      id: p.name,
      name: p.project_name || p.name,
      customer: p.customer || 'Direct Customer',
      company: p.company || 'Enterprise',
      status: p.status || 'Open',
      projectType: p.project_type || 'Internal',
      priority: p.priority || 'Medium',
      creation: (p.creation || '').split(' ')[0],
      percentCompleted: Number(p.percent_completed) || 0,
      expectedStartDate: p.expected_start_date || '',
      expectedEndDate: p.expected_end_date || '',
      assignedUsers: this.parseAssignees(p._assign),
      tasks: []
    }));
  }

  /**
   * Fetch all tasks for a specific project
   */
  async getTasks(projectId) {
    const query = new URLSearchParams({
      filters: JSON.stringify([["project", "=", projectId]]),
      fields: JSON.stringify([
        "name", "subject", "project", "status", "priority", "exp_end_date",
        "assigned_to", "custom_category", "type", "progress", "creation"
      ]),
      limit_page_length: 200,
      order_by: "exp_end_date asc, creation asc"
    });

    const res = await fetch(`${this.baseUrl}/api/resource/Task?${query}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
    const data = await res.json();
    return (data.data || []).map(t => ({
      id: t.name,
      subject: t.subject,
      project: t.project,
      category: this.inferCategory(t),
      status: t.status,
      priority: t.priority || 'Medium',
      progress: t.progress || (t.status === 'Completed' ? 100 : 0),
      creation: (t.creation || '').split(' ')[0] || '',
      exp_end_date: t.exp_end_date || '',
      expectedEndDate: t.exp_end_date || '',
      assignee: t.assigned_to || (t._assign ? this.parseAssignees(t._assign)[0]?.name : 'Unassigned') || 'Unassigned'
    }));
  }

  /**
   * Create a new Task in ERPNext directly into Task DocType
   */
  async createTask(taskData) {
    const payload = {
      subject: taskData.subject,
      project: taskData.project || taskData.projectId,
      status: taskData.status || 'Open',
      priority: taskData.priority || 'Medium',
      custom_category: taskData.category || taskData.custom_category || 'Development',
      type: taskData.category || 'Development',
      assigned_to: taskData.assignee || taskData.assigned_to || '',
      exp_end_date: taskData.exp_end_date || taskData.expectedEndDate || taskData.dueDate,
      progress: taskData.status === 'Completed' ? 100 : (taskData.status === 'Working' ? 50 : 0)
    };

    const res = await fetch(`${this.baseUrl}/api/resource/Task`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed to create task: ${res.statusText}`);
    return await res.json();
  }

  /**
   * Update task status & progress in ERPNext
   */
  async updateTaskStatus(taskId, status, progress) {
    const calculatedProgress = progress !== undefined ? progress : (status === "Completed" ? 100 : (status === "Open" ? 0 : 50));
    const payload = {
      status: status,
      progress: calculatedProgress
    };
    if (status === "Completed") {
      payload.completed_on = new Date().toISOString().split('T')[0];
    }

    const res = await fetch(`${this.baseUrl}/api/resource/Task/${encodeURIComponent(taskId)}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed to update task: ${res.statusText}`);
    return await res.json();
  }
}
