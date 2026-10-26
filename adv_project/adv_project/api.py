import frappe
from frappe import _
from frappe.utils import getdate, nowdate, get_fullname

@frappe.whitelist()
def get_logged_user_info():
    """Returns the authenticated session user details."""
    user = frappe.session.user
    if user == "Guest":
        return {
            "logged_in": False,
            "user": "Guest"
        }
    
    user_doc = frappe.get_cached_doc("User", user)
    return {
        "logged_in": True,
        "user": user,
        "full_name": get_fullname(user),
        "email": user_doc.email,
        "user_image": user_doc.user_image or "",
        "roles": frappe.get_roles(user)
    }

@frappe.whitelist()
def get_project_cockpit_data():
    """
    Consolidated high-performance loader.
    Fetches all accessible projects and linked tasks in 2 database queries.
    """
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    # 1. Fetch Projects
    projects = frappe.get_all(
        "Project",
        fields=[
            "name as id",
            "project_name",
            "status",
            "priority",
            "percent_complete_method",
            "percent_complete",
            "expected_start_date",
            "expected_end_date",
            "customer",
            "project_type",
            "is_active",
            "department",
            "notes",
            "creation"
        ],
        order_by="creation desc",
        limit_page_length=200
    )

    if not projects:
        return {"projects": [], "summary": {}}

    project_ids = [p["id"] for p in projects]

    # 2. Fetch Tasks for all projects in one batch query
    tasks = frappe.get_all(
        "Task",
        filters={"project": ["in", project_ids]},
        fields=[
            "name as id",
            "subject",
            "status",
            "priority",
            "project",
            "exp_start_date",
            "exp_end_date",
            "expected_time",
            "actual_time",
            "_assign",
            "creation"
        ],
        order_by="creation desc",
        limit_page_length=2000
    )

    # 3. Group tasks by project
    tasks_by_project = {}
    today = getdate(nowdate())

    total_tasks_count = len(tasks)
    total_completed_tasks = 0
    total_working_tasks = 0
    total_open_tasks = 0
    total_overdue_tasks = 0

    for t in tasks:
        p_id = t["project"]
        if p_id not in tasks_by_project:
            tasks_by_project[p_id] = []
        
        # Parse assignees
        assignees = []
        if t.get("_assign"):
            try:
                import json
                assignees = json.loads(t["_assign"])
            except Exception:
                assignees = [t["_assign"]]
        t["assigned_to"] = assignees

        # Check overdue
        is_overdue = False
        if t.get("exp_end_date") and t.get("status") not in ["Completed", "Cancelled"]:
            if getdate(t["exp_end_date"]) < today:
                is_overdue = True
                total_overdue_tasks += 1
        t["is_overdue"] = is_overdue

        # Aggregate counts
        if t.get("status") == "Completed":
            total_completed_tasks += 1
        elif t.get("status") in ["Working", "In Progress"]:
            total_working_tasks += 1
        else:
            total_open_tasks += 1

        tasks_by_project[p_id].append(t)

    # 4. Attach tasks to projects and compute dynamic completion
    for p in projects:
        p_tasks = tasks_by_project.get(p["id"], [])
        p["tasks"] = p_tasks
        
        if p_tasks:
            comp = len([t for t in p_tasks if t.get("status") == "Completed"])
            calc_percent = round((comp / len(p_tasks)) * 100)
            p["calculated_percent"] = calc_percent
            if not p.get("percent_complete"):
                p["percent_complete"] = calc_percent
        else:
            p["calculated_percent"] = p.get("percent_complete") or 0

    return {
        "projects": projects,
        "summary": {
            "total_projects": len(projects),
            "total_tasks": total_tasks_count,
            "completed_tasks": total_completed_tasks,
            "working_tasks": total_working_tasks,
            "open_tasks": total_open_tasks,
            "overdue_tasks": total_overdue_tasks
        },
        "user": get_logged_user_info()
    }

@frappe.whitelist()
def update_task_status(task_id, status):
    """Update task status with permission checks."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    task = frappe.get_doc("Task", task_id)
    task.status = status
    task.save(ignore_permissions=False)
    
    # Reload project to calculate progress
    if task.project:
        try:
            proj = frappe.get_doc("Project", task.project)
            proj.flags.dont_sync_tasks = True
            proj.save(ignore_permissions=True)
        except Exception:
            pass

    return {
        "success": True,
        "task_id": task_id,
        "status": status
    }

@frappe.whitelist()
def create_project(project_name, project_type=None, customer=None, expected_end_date=None, priority=None):
    """Create a new Project document."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    doc = frappe.new_doc("Project")
    doc.project_name = project_name
    doc.status = "Open"
    if project_type:
        doc.project_type = project_type
    if customer:
        doc.customer = customer
    if expected_end_date:
        doc.expected_end_date = expected_end_date
    if priority:
        doc.priority = priority

    doc.insert(ignore_permissions=False)
    return doc.as_dict()

@frappe.whitelist()
def create_task(project, subject, status="Open", priority="Medium", exp_end_date=None, assigned_to=None):
    """Create a new Task and optionally assign it."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    doc = frappe.new_doc("Task")
    doc.project = project
    doc.subject = subject
    doc.status = status
    doc.priority = priority
    if exp_end_date:
        doc.exp_end_date = exp_end_date

    doc.insert(ignore_permissions=False)

    if assigned_to:
        from frappe.desk.form import assign_to
        assign_to.add({
            "doctype": "Task",
            "name": doc.name,
            "assign_to": [assigned_to]
        })

    return doc.as_dict()
