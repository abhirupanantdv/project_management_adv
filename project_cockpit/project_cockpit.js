frappe.pages['project-cockpit'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __('Project Cockpit'),
        single_column: true
    });

    let currentView = 'cards'; // 'cards' or 'kanban'
    let currentStatus = 'All';
    let searchTerm = '';
    let dashboardData = null;

    // Add Refresh Button to Page Actions
    page.set_primary_action(__('Refresh'), () => {
        loadData();
    }, 'octicon octicon-sync');

    // Create Base Container
    const $container = $(`
        <div class="project-cockpit-container">
            <!-- Header & Filter Controls -->
            <div class="pc-header-bar">
                <div class="pc-title-group">
                    <h2>Project & Task Visualizer</h2>
                    <p>Real-time project overview, task breakdown, and live progress rollups</p>
                </div>
                <div class="pc-filters">
                    <input type="text" class="pc-search-input" id="pc-search" placeholder="Search project name..." />
                    <select class="pc-select" id="pc-status-filter">
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Working">Working</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div class="pc-view-btn-group">
                        <button class="pc-view-btn active" data-view="cards">Project View</button>
                        <button class="pc-view-btn" data-view="kanban">Task Kanban</button>
                    </div>
                </div>
            </div>

            <!-- KPI Cards Section -->
            <div class="pc-kpi-grid" id="pc-kpis"></div>

            <!-- Main Content Area -->
            <div id="pc-main-content"></div>
        </div>
    `).appendTo(page.main);

    // Event Bindings
    $container.find('#pc-search').on('input', function() {
        searchTerm = $(this).val().toLowerCase();
        renderView();
    });

    $container.find('#pc-status-filter').on('change', function() {
        currentStatus = $(this).val();
        loadData();
    });

    $container.find('.pc-view-btn').on('click', function() {
        $container.find('.pc-view-btn').removeClass('active');
        $(this).addClass('active');
        currentView = $(this).data('view');
        renderView();
    });

    // Initial Load
    loadData();

    function loadData() {
        frappe.call({
            method: 'project_cockpit.project_cockpit.get_project_dashboard_data',
            args: {
                status_filter: currentStatus,
                search_term: searchTerm
            },
            freeze: true,
            freeze_message: __('Loading Project Metrics...'),
            callback: function(r) {
                if (r.message) {
                    dashboardData = r.message;
                    renderKPIs(dashboardData.kpi);
                    renderView();
                }
            }
        });
    }

    function renderKPIs(kpi) {
        const $kpiContainer = $container.find('#pc-kpis');
        $kpiContainer.html(`
            <div class="pc-kpi-card">
                <div class="pc-kpi-icon blue">📁</div>
                <div class="pc-kpi-info">
                    <h4>Total Projects</h4>
                    <div class="pc-kpi-val">${kpi.total_projects}</div>
                </div>
            </div>
            <div class="pc-kpi-card">
                <div class="pc-kpi-icon amber">⚡</div>
                <div class="pc-kpi-info">
                    <h4>Active Projects</h4>
                    <div class="pc-kpi-val">${kpi.active_projects}</div>
                </div>
            </div>
            <div class="pc-kpi-card">
                <div class="pc-kpi-icon green">📈</div>
                <div class="pc-kpi-info">
                    <h4>Overall Progress</h4>
                    <div class="pc-kpi-val">${kpi.overall_progress}%</div>
                </div>
            </div>
            <div class="pc-kpi-card">
                <div class="pc-kpi-icon purple">✓</div>
                <div class="pc-kpi-info">
                    <h4>Completed Tasks</h4>
                    <div class="pc-kpi-val">${kpi.completed_tasks} / ${kpi.total_tasks}</div>
                </div>
            </div>
            <div class="pc-kpi-card">
                <div class="pc-kpi-icon red">⚠️</div>
                <div class="pc-kpi-info">
                    <h4>Overdue Tasks</h4>
                    <div class="pc-kpi-val">${kpi.overdue_tasks}</div>
                </div>
            </div>
        `);
    }

    function renderView() {
        if (!dashboardData) return;

        const filteredProjects = dashboardData.projects.filter(p => {
            return !searchTerm || p.project_name.toLowerCase().includes(searchTerm) || p.name.toLowerCase().includes(searchTerm);
        });

        const $content = $container.find('#pc-main-content');
        $content.empty();

        if (filteredProjects.length === 0) {
            $content.html('<div class="pc-empty-state">No projects found matching your criteria.</div>');
            return;
        }

        if (currentView === 'cards') {
            renderProjectCards(filteredProjects, $content);
        } else {
            renderKanbanView(filteredProjects, $content);
        }
    }

    function renderProjectCards(projects, $target) {
        projects.forEach(project => {
            const statusClass = (project.status || 'open').toLowerCase().replace(/\s+/g, '-');
            const $projCard = $(`
                <div class="pc-project-card expanded" data-project="${project.name}">
                    <div class="pc-project-header">
                        <div class="pc-proj-left">
                            <span class="pc-toggle-icon">▶</span>
                            <div>
                                <a href="/app/project/${project.name}" class="pc-proj-name-link" target="_blank">
                                    ${frappe.utils.escape_html(project.project_name)}
                                </a>
                                <span style="font-size:0.8rem; color:#6b7280; margin-left:0.5rem;">(${project.name})</span>
                                <span class="pc-badge ${statusClass}" style="margin-left:0.5rem;">${project.status}</span>
                            </div>
                        </div>
                        <div class="pc-proj-right">
                            <div class="pc-task-counts">
                                <span>Tasks: <strong>${project.completed_tasks}/${project.total_tasks}</strong></span>
                                ${project.overdue_tasks > 0 ? `<span style="color:#dc2626;">(${project.overdue_tasks} Overdue)</span>` : ''}
                            </div>
                            <div class="pc-progress-wrapper">
                                <div class="pc-progress-bar-bg">
                                    <div class="pc-progress-bar-fill" style="width: ${project.percent_completed}%"></div>
                                </div>
                                <span class="pc-progress-pct">${project.percent_completed}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="pc-project-body">
                        ${renderTasksTable(project.tasks)}
                    </div>
                </div>
            `);

            // Toggle Expand / Collapse
            $projCard.find('.pc-project-header').on('click', function(e) {
                if ($(e.target).is('a') || $(e.target).closest('a').length) return;
                $projCard.toggleClass('expanded');
            });

            // Bind Quick Task Status Updater
            $projCard.find('.pc-task-status-select').on('change', function(e) {
                e.stopPropagation();
                const taskName = $(this).data('task');
                const newStatus = $(this).val();
                quickUpdateTask(taskName, newStatus);
            });

            $target.append($projCard);
        });
    }

    function renderTasksTable(tasks) {
        if (!tasks || tasks.length === 0) {
            return '<div style="padding:1rem; color:#9ca3af; font-size:0.85rem;">No tasks created for this project yet.</div>';
        }

        let rowsHtml = tasks.map(task => {
            const statusClass = (task.status || 'open').toLowerCase().replace(/\s+/g, '-');
            return `
                <tr class="pc-task-row">
                    <td style="font-weight: 500;">
                        <a href="/app/task/${task.name}" target="_blank" style="color: #2563eb; text-decoration:none;">
                            ${task.name}
                        </a>
                    </td>
                    <td>${frappe.utils.escape_html(task.subject || '')}</td>
                    <td><span class="pc-badge ${statusClass}">${task.status}</span></td>
                    <td>
                        <select class="pc-task-status-select" data-task="${task.name}">
                            <option value="Open" ${task.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="Working" ${task.status === 'Working' ? 'selected' : ''}>Working</option>
                            <option value="Pending Review" ${task.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${task.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td style="font-size:0.8rem; color:#6b7280;">${task.exp_start_date || '-'}</td>
                    <td style="font-size:0.8rem; color:#6b7280;">${task.exp_end_date || '-'}</td>
                    <td><strong>${task.progress || 0}%</strong></td>
                </tr>
            `;
        }).join('');

        return `
            <table class="pc-task-table">
                <thead>
                    <tr>
                        <th style="width: 140px;">Task ID</th>
                        <th>Subject</th>
                        <th style="width: 100px;">Status</th>
                        <th style="width: 140px;">Quick Action</th>
                        <th style="width: 110px;">Start Date</th>
                        <th style="width: 110px;">Due Date</th>
                        <th style="width: 80px;">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;
    }

    function renderKanbanView(projects, $target) {
        const columns = ['Open', 'Working', 'Pending Review', 'Completed'];
        const allTasks = [];

        projects.forEach(p => {
            (p.tasks || []).forEach(t => {
                allTasks.push({ ...t, project_name: p.project_name });
            });
        });

        let colsHtml = columns.map(col => {
            const colTasks = allTasks.filter(t => t.status === col);
            const taskCardsHtml = colTasks.map(t => `
                <div class="pc-kanban-card">
                    <div style="font-size:0.75rem; color:#2563eb; font-weight:600; margin-bottom:0.25rem;">
                        📁 ${frappe.utils.escape_html(t.project_name)}
                    </div>
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom:0.4rem;">
                        <a href="/app/task/${t.name}" target="_blank" style="color:inherit; text-decoration:none;">
                            ${frappe.utils.escape_html(t.subject)}
                        </a>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#6b7280;">
                        <span>${t.name}</span>
                        <span>Due: ${t.exp_end_date || 'N/A'}</span>
                    </div>
                </div>
            `).join('');

            return `
                <div class="pc-kanban-col">
                    <div class="pc-kanban-col-title">
                        <span>${col}</span>
                        <span class="pc-badge open">${colTasks.length}</span>
                    </div>
                    <div class="pc-kanban-cards-container">
                        ${taskCardsHtml || '<div style="color:#9ca3af; font-size:0.8rem; text-align:center; padding:1rem;">No tasks</div>'}
                    </div>
                </div>
            `;
        }).join('');

        $target.html(`<div class="pc-kanban-board">${colsHtml}</div>`);
    }

    function quickUpdateTask(taskName, newStatus) {
        frappe.call({
            method: 'project_cockpit.project_cockpit.update_task_status_quick',
            args: {
                task_name: taskName,
                new_status: newStatus
            },
            callback: function(r) {
                if (r.message && r.message.status === 'success') {
                    frappe.show_alert({
                        message: __('Task and Project status updated successfully'),
                        indicator: 'green'
                    }, 3);
                    loadData();
                }
            }
        });
    }
};
