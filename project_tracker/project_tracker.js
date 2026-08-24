/**
 * ERPNext v15 Custom React Desk Page: Project Tracker
 * Page Name: project-tracker
 * Module: Projects
 * Single-Screen Project -> Details -> Task Tree experience
 * Consumes standard ERPNext Project and Task DocTypes via Frappe API
 */

frappe.pages['project-tracker'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __('Project Tracker'),
        single_column: true
    });

    frappe.breadcrumbs.add('Projects');

    var $container = $('<div class="project-tracker-root" id="project-tracker-mount"></div>').appendTo(page.main);

    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    Promise.all([
        window.React ? Promise.resolve() : loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
        window.ReactDOM ? Promise.resolve() : loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
        window.Babel ? Promise.resolve() : loadScript('https://unpkg.com/@babel/standalone/babel.min.js')
    ]).then(function() {
        mountReactApp(page, $container[0]);
    }).catch(function(err) {
        console.error("Failed to load React in Frappe Desk:", err);
        $container.html('<div class="alert alert-danger">Failed to initialize React Project Tracker.</div>');
    });
};

function mountReactApp(frappePage, domNode) {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const { useState, useEffect, useMemo, useCallback } = React;

    const CATEGORIES = {
        DEVELOPMENT: "Development",
        UI: "UI",
        MIGRATION: "Migration",
        TESTING: "Testing",
        DOCUMENTATION: "Documentation"
    };

    const CATEGORY_CONFIG = {
        "Development": { label: "Development", icon: "💻", color: "indigo", bgClass: "bg-indigo-50 text-indigo-700 border-indigo-200", barColor: "bg-indigo-600" },
        "UI": { label: "UI", icon: "🎨", color: "purple", bgClass: "bg-purple-50 text-purple-700 border-purple-200", barColor: "bg-purple-600" },
        "Migration": { label: "Migration", icon: "🔄", color: "amber", bgClass: "bg-amber-50 text-amber-700 border-amber-200", barColor: "bg-amber-500" },
        "Testing": { label: "Testing", icon: "🧪", color: "emerald", bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200", barColor: "bg-emerald-600" },
        "Documentation": { label: "Documentation", icon: "📄", color: "sky", bgClass: "bg-sky-50 text-sky-700 border-sky-200", barColor: "bg-sky-500" }
    };

    function ProjectTrackerApp() {
        const [dashboardData, setDashboardData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [activeView, setActiveView] = useState('tree'); // 'tree' | 'table' | 'kanban' | 'analytics'
        const [selectedProjectId, setSelectedProjectId] = useState('');
        const [collapsedCategories, setCollapsedCategories] = useState({});

        const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
        const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
        const [isDetailsOpen, setIsDetailsOpen] = useState(false);

        const loadData = useCallback(() => {
            setLoading(true);
            frappe.call({
                method: 'project_tracker.project_tracker.get_project_dashboard_data',
                callback: function(r) {
                    if (r && r.message) {
                        setDashboardData(r.message);
                        if (!selectedProjectId && r.message.projects && r.message.projects.length > 0) {
                            setSelectedProjectId(r.message.projects[0].name);
                        }
                        setLoading(false);
                    } else {
                        fallbackLoadData();
                    }
                },
                error: function() {
                    fallbackLoadData();
                }
            });
        }, [selectedProjectId]);

        const fallbackLoadData = () => {
            Promise.all([
                frappe.db.get_list('Project', {
                    fields: ['name', 'project_name', 'status', 'priority', 'customer', 'project_type', 'expected_start_date', 'expected_end_date', 'percent_completed', 'creation', '_assign'],
                    limit: 100,
                    order_by: 'creation desc'
                }),
                frappe.db.get_list('Task', {
                    fields: ['name', 'subject', 'project', 'status', 'priority', 'exp_end_date', 'type', 'progress', 'creation', '_assign'],
                    limit: 500
                })
            ]).then(([projects, tasks]) => {
                const tasksByProj = {};
                tasks.forEach(t => {
                    t.category = t.type || 'Development';
                    t.assignee = 'Unassigned';
                    if (t._assign) {
                        try {
                            const raw = JSON.parse(t._assign);
                            if (Array.isArray(raw) && raw.length > 0) {
                                t.assignee = raw[0].split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
                            }
                        } catch (e) {}
                    }
                    tasksByProj[t.project] = tasksByProj[t.project] || [];
                    tasksByProj[t.project].push(t);
                });

                const projectList = projects.map(p => {
                    const pTasks = tasksByProj[p.name] || [];
                    const comp = pTasks.filter(t => t.status === 'Completed').length;
                    const pct = pTasks.length > 0 ? Math.round((comp / pTasks.length) * 100) : (p.percent_completed || 0);
                    return {
                        name: p.name,
                        project_name: p.project_name || p.name,
                        customer: p.customer || 'Enterprise',
                        status: p.status || 'Open',
                        priority: p.priority || 'Medium',
                        project_type: p.project_type || 'Internal',
                        creation: p.creation ? p.creation.split(' ')[0] : '',
                        expected_start_date: p.expected_start_date || '',
                        expected_end_date: p.expected_end_date || '',
                        percent_completed: pct,
                        total_tasks: pTasks.length,
                        completed_tasks: comp,
                        tasks: pTasks,
                        assigned_users: []
                    };
                });

                setDashboardData({ projects: projectList });
                if (!selectedProjectId && projectList.length > 0) {
                    setSelectedProjectId(projectList[0].name);
                }
                setLoading(false);
            }).catch(() => setLoading(false));
        };

        useEffect(() => {
            loadData();
        }, [loadData]);

        useEffect(() => {
            frappePage.clear_actions();
            frappePage.set_primary_action(__('Create Task'), () => {
                setIsNewTaskModalOpen(true);
            }, 'octicon octicon-plus');

            frappePage.add_action_icon('octicon octicon-sync', () => {
                loadData();
                frappe.show_alert({ message: __('Dashboard refreshed'), indicator: 'green' });
            });
        }, [loadData, frappePage]);

        const handleStatusChange = (taskName, newStatus) => {
            frappe.call({
                method: 'project_tracker.project_tracker.update_task_status_quick',
                args: { task_name: taskName, new_status: newStatus },
                callback: function(r) {
                    if (r && r.message) {
                        frappe.show_alert({ message: __('Task status updated to ') + newStatus, indicator: 'green' });
                        loadData();
                    } else {
                        frappe.db.set_value('Task', taskName, {
                            status: newStatus,
                            progress: newStatus === 'Completed' ? 100 : (newStatus === 'Open' ? 0 : 50)
                        }).then(() => {
                            frappe.show_alert({ message: __('Task status updated'), indicator: 'green' });
                            loadData();
                        });
                    }
                }
            });
        };

        const handleCreateTask = (taskPayload) => {
            frappe.call({
                method: 'project_tracker.project_tracker.create_task_quick',
                args: taskPayload,
                callback: function(r) {
                    if (r && r.message) {
                        frappe.show_alert({ message: __('Task created successfully!'), indicator: 'green' });
                        setIsNewTaskModalOpen(false);
                        loadData();
                    } else {
                        frappe.db.insert({
                            doctype: 'Task',
                            subject: taskPayload.subject,
                            project: taskPayload.project,
                            type: taskPayload.category,
                            priority: taskPayload.priority,
                            status: taskPayload.status,
                            exp_end_date: taskPayload.exp_end_date,
                            progress: taskPayload.status === 'Completed' ? 100 : 0
                        }).then(() => {
                            frappe.show_alert({ message: __('Task created successfully!'), indicator: 'green' });
                            setIsNewTaskModalOpen(false);
                            loadData();
                        });
                    }
                }
            });
        };

        if (loading || !dashboardData) {
            return React.createElement('div', { className: 'p-10 text-center text-slate-500' },
                React.createElement('div', { className: 'spinner-border text-primary mb-3', role: 'status' }),
                React.createElement('h5', null, __('Loading ERPNext Projects and Tasks...'))
            );
        }

        const projects = dashboardData.projects || [];
        const activeProject = projects.find(p => p.name === selectedProjectId) || projects[0];
        const activeTasks = activeProject?.tasks || [];
        const totalActiveTasks = activeTasks.length;
        const completedActiveTasks = activeTasks.filter(t => t.status === 'Completed').length;
        
        // Progress % = Completed Tasks ÷ Total Tasks × 100
        const activeProgress = totalActiveTasks > 0 ? Math.round((completedActiveTasks / totalActiveTasks) * 100) : (activeProject?.percent_completed || 0);

        // Group tasks by category
        const tasksByCategory = {};
        Object.values(CATEGORIES).forEach(c => {
            tasksByCategory[c] = activeTasks.filter(t => (t.category || t.type) === c);
        });

        // Extract assigned members from Task _assign / assigned_to
        const assignedMembers = Array.from(new Set(activeTasks.map(t => t.assignee).filter(a => a && a !== 'Unassigned')));

        return React.createElement('div', { className: 'space-y-5' },
            
            // View Switcher Bar
            React.createElement('div', { className: 'bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-3' },
                React.createElement('div', { className: 'flex items-center space-x-1 bg-slate-100 p-1 rounded-xl' },
                    [
                        { id: 'tree', label: 'Project Tree View', icon: '🌲' },
                        { id: 'table', label: 'Projects Table', icon: '📑' },
                        { id: 'kanban', label: 'Kanban Board', icon: '🗂️' }
                    ].map(v => React.createElement('button', {
                        key: v.id,
                        onClick: () => setActiveView(v.id),
                        className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeView === v.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`
                    }, `${v.icon} ${v.label}`))
                ),
                React.createElement('div', { className: 'text-xs text-slate-500 font-semibold' }, 'Single-Screen Project → Details → Task Tree')
            ),

            // 1. PROJECT → DETAILS → TASK TREE VIEW
            activeView === 'tree' && activeProject && React.createElement('div', { className: 'space-y-5' },
                
                // Project Dropdown Selector
                React.createElement('div', { className: 'bg-white p-5 rounded-2xl border border-slate-200 shadow-sm' },
                    React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4' },
                        React.createElement('div', { className: 'flex-1' },
                            React.createElement('label', { className: 'block text-xs font-bold uppercase text-slate-500 mb-1.5' }, 'Select Project Dropdown'),
                            React.createElement('select', {
                                value: selectedProjectId,
                                onChange: e => setSelectedProjectId(e.target.value),
                                className: 'w-full md:max-w-xl p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 cursor-pointer'
                            },
                                projects.map(p => React.createElement('option', { key: p.name, value: p.name }, `[${p.name}] ${p.project_name} — Customer: ${p.customer || 'Enterprise'} (${p.status})`))
                            )
                        ),
                        React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement('button', {
                                onClick: () => setIsNewTaskModalOpen(true),
                                className: 'px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700'
                            }, `+ Add Task to ${activeProject.name}`),
                            React.createElement('button', {
                                onClick: () => frappe.set_route('Form', 'Project', activeProject.name),
                                className: 'px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200'
                            }, 'Open Form ↗')
                        )
                    )
                ),

                // Selected Project Details Card
                React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4' },
                    React.createElement('div', { className: 'flex flex-col lg:flex-row lg:justify-between gap-4 pb-4 border-b' },
                        React.createElement('div', null,
                            React.createElement('div', { className: 'flex items-center space-x-2 mb-1' },
                                React.createElement('span', { className: 'font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded' }, activeProject.name),
                                React.createElement('span', { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${activeProject.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}` }, activeProject.status),
                                React.createElement('span', { className: 'px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800' }, `${activeProject.priority} Priority`),
                                React.createElement('span', { className: 'text-xs text-slate-500' }, `🏢 Customer: `, React.createElement('strong', null, activeProject.customer || 'Enterprise'))
                            ),
                            React.createElement('h2', { className: 'text-2xl font-bold text-slate-900' }, activeProject.project_name),
                            React.createElement('p', { className: 'text-xs text-slate-500 mt-1' }, `Start: ${activeProject.expected_start_date || activeProject.creation} • End: ${activeProject.expected_end_date || '—'}`)
                        ),
                        React.createElement('div', null,
                            React.createElement('span', { className: 'text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1' }, `Assigned Members (${assignedMembers.length})`),
                            React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
                                assignedMembers.length > 0 ? assignedMembers.map((m, idx) => React.createElement('span', {
                                    key: idx,
                                    className: 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border'
                                }, `👤 ${m}`)) : React.createElement('span', { className: 'text-xs text-slate-400' }, 'No members assigned')
                            )
                        )
                    ),

                    // Automated Progress Calculation Bar
                    React.createElement('div', null,
                        React.createElement('div', { className: 'flex justify-between text-xs font-semibold mb-1.5' },
                            React.createElement('span', null, `Overall Progress: `, React.createElement('strong', null, `${activeProgress}%`), ` (${completedActiveTasks} of ${totalActiveTasks} Tasks Completed)`),
                            React.createElement('span', { className: 'text-slate-500' }, `${totalActiveTasks - completedActiveTasks} Pending`)
                        ),
                        React.createElement('div', { className: 'w-full bg-slate-100 h-3 rounded-full overflow-hidden' },
                            React.createElement('div', { className: 'bg-emerald-500 h-full rounded-full transition-all duration-500', style: { width: `${activeProgress}%` } })
                        )
                    )
                ),

                // Hierarchical Category Task Tree View
                React.createElement('div', { className: 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
                    React.createElement('div', { className: 'px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50' },
                        React.createElement('div', null,
                            React.createElement('h3', { className: 'text-sm font-bold' }, '🌲 Project Task Tree Hierarchy'),
                            React.createElement('p', { className: 'text-xs text-slate-500' }, 'Grouped by Category with Assignee and Due Date')
                        ),
                        React.createElement('div', { className: 'flex space-x-2 text-xs' },
                            React.createElement('button', { onClick: () => setCollapsedCategories({}), className: 'text-indigo-600 font-semibold hover:underline' }, 'Expand All'),
                            React.createElement('span', null, '•'),
                            React.createElement('button', { onClick: () => {
                                const all = {};
                                Object.values(CATEGORIES).forEach(c => all[c] = true);
                                setCollapsedCategories(all);
                            }, className: 'text-slate-500 font-semibold hover:underline' }, 'Collapse All')
                        )
                    ),

                    React.createElement('div', { className: 'divide-y divide-slate-100' },
                        Object.values(CATEGORIES).map(cat => {
                            const conf = CATEGORY_CONFIG[cat];
                            const cTasks = tasksByCategory[cat] || [];
                            const cTotal = cTasks.length;
                            const cComp = cTasks.filter(t => t.status === 'Completed').length;
                            const cPct = cTotal > 0 ? Math.round((cComp / cTotal) * 100) : 0;
                            const isCol = collapsedCategories[cat];

                            return React.createElement('div', { key: cat, className: 'p-4 sm:p-5' },
                                React.createElement('div', {
                                    onClick: () => setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] })),
                                    className: 'flex justify-between items-center cursor-pointer select-none'
                                },
                                    React.createElement('div', { className: 'flex items-center space-x-3' },
                                        React.createElement('span', { className: 'w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold' }, isCol ? '▶' : '▼'),
                                        React.createElement('span', { className: `px-3 py-1 rounded-lg text-xs font-bold border ${conf.bgClass}` }, `${conf.icon} ${cat}`),
                                        React.createElement('span', { className: 'text-xs font-bold' }, `${cTotal} ${cTotal === 1 ? 'Task' : 'Tasks'}`)
                                    ),
                                    React.createElement('div', { className: 'flex items-center space-x-3' },
                                        React.createElement('div', { className: 'w-28 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block' },
                                            React.createElement('div', { className: `${conf.barColor} h-full rounded-full`, style: { width: `${cPct}%` } })
                                        ),
                                        React.createElement('span', { className: 'text-xs font-bold' }, `${cComp}/${cTotal} (${cPct}%)`)
                                    )
                                ),

                                !isCol && React.createElement('div', { className: 'mt-3.5 pl-4 sm:pl-9 space-y-2 border-l-2 border-slate-100 ml-3' },
                                    cTasks.length === 0 ? React.createElement('div', { className: 'p-3 text-xs text-slate-400 italic bg-slate-50 rounded-xl' }, `No ${cat} tasks.`) :
                                    cTasks.map(task => {
                                        const isDone = task.status === 'Completed';
                                        return React.createElement('div', {
                                            key: task.name,
                                            className: 'p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs'
                                        },
                                            React.createElement('div', null,
                                                React.createElement('div', { className: 'flex items-center space-x-2' },
                                                    React.createElement('a', {
                                                        href: `/app/task/${encodeURIComponent(task.name)}`,
                                                        onClick: e => { e.preventDefault(); frappe.set_route('Form', 'Task', task.name); },
                                                        className: 'font-mono text-xs font-bold text-indigo-600 hover:underline'
                                                    }, task.name),
                                                    React.createElement('h4', { className: `font-semibold ${isDone ? 'line-through text-slate-400' : ''}` }, task.subject)
                                                ),
                                                React.createElement('div', { className: 'flex items-center space-x-2 mt-1 text-[11px] text-slate-500' },
                                                    React.createElement('span', null, `👤 Assignee: `, React.createElement('strong', null, task.assignee || 'Unassigned')),
                                                    React.createElement('span', null, '•'),
                                                    React.createElement('span', null, `📅 Due: `, React.createElement('strong', null, task.exp_end_date || '—'))
                                                )
                                            ),
                                            React.createElement('div', { className: 'flex items-center space-x-2' },
                                                React.createElement('span', { className: `px-2 py-0.5 rounded text-[11px] font-semibold ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}` }, task.status),
                                                !isDone ? React.createElement('button', {
                                                    onClick: () => handleStatusChange(task.name, 'Completed'),
                                                    className: 'px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]'
                                                }, 'Done') : React.createElement('button', {
                                                    onClick: () => handleStatusChange(task.name, 'Open'),
                                                    className: 'px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-bold text-[10px]'
                                                }, 'Reopen')
                                            )
                                        );
                                    })
                                )
                            );
                        })
                    )
                )

            ),

            // 2. Table View
            activeView === 'table' && React.createElement('div', { className: 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
                React.createElement('table', { className: 'w-full text-left border-collapse text-xs' },
                    React.createElement('thead', null,
                        React.createElement('tr', { className: 'border-b bg-slate-50 text-[11px] font-bold text-slate-500 uppercase' },
                            React.createElement('th', { className: 'py-3.5 px-4' }, 'Project Name & ID'),
                            React.createElement('th', { className: 'py-3.5 px-4' }, 'Customer'),
                            React.createElement('th', { className: 'py-3.5 px-3' }, 'Status'),
                            React.createElement('th', { className: 'py-3.5 px-3' }, 'Tasks'),
                            React.createElement('th', { className: 'py-3.5 px-4 text-center' }, 'Overall Progress (%)'),
                            React.createElement('th', { className: 'py-3.5 px-4 text-right' }, 'Action')
                        )
                    ),
                    React.createElement('tbody', { className: 'divide-y' },
                        projects.map(p => {
                            const comp = p.completed_tasks || 0;
                            const total = p.total_tasks || 0;
                            const pct = p.percent_completed || 0;
                            return React.createElement('tr', { key: p.name, className: 'hover:bg-slate-50' },
                                React.createElement('td', { className: 'py-3.5 px-4' },
                                    React.createElement('button', { onClick: () => { setSelectedProjectId(p.name); setActiveView('tree'); }, className: 'text-left' },
                                        React.createElement('span', { className: 'font-mono text-xs font-bold text-indigo-600 block' }, p.name),
                                        React.createElement('span', { className: 'font-bold text-slate-900 text-sm' }, p.project_name)
                                    )
                                ),
                                React.createElement('td', { className: 'py-3.5 px-4 font-semibold' }, `🏢 ${p.customer || 'Enterprise'}`),
                                React.createElement('td', { className: 'py-3.5 px-3' }, React.createElement('span', { className: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800' }, p.status)),
                                React.createElement('td', { className: 'py-3.5 px-3 font-bold' }, `${comp} / ${total} Done`),
                                React.createElement('td', { className: 'py-3.5 px-4' },
                                    React.createElement('div', { className: 'flex items-center space-x-2' },
                                        React.createElement('div', { className: 'flex-1 bg-slate-100 h-2 rounded-full overflow-hidden' },
                                            React.createElement('div', { className: 'bg-emerald-500 h-full rounded-full', style: { width: `${pct}%` } })
                                        ),
                                        React.createElement('span', { className: 'font-bold' }, `${pct}%`)
                                    )
                                ),
                                React.createElement('td', { className: 'py-3.5 px-4 text-right' },
                                    React.createElement('button', { onClick: () => { setSelectedProjectId(p.name); setActiveView('tree'); }, className: 'px-2.5 py-1 rounded text-xs font-semibold text-indigo-600 border' }, 'Open Tree ➔')
                                )
                            );
                        })
                    )
                )
            ),

            // Modal Create Task
            isNewTaskModalOpen && React.createElement(CreateTaskModal, {
                projects: projects,
                selectedProjectId: selectedProjectId,
                onClose: () => setIsNewTaskModalOpen(false),
                onSubmit: handleCreateTask
            })
        );
    }

    function CreateTaskModal({ projects, selectedProjectId, onClose, onSubmit }) {
        const [subject, setSubject] = useState('');
        const [project, setProject] = useState(selectedProjectId || (projects[0] ? projects[0].name : ''));
        const [category, setCategory] = useState('Development');
        const [assignee, setAssignee] = useState(frappe.session.user || '');
        const [priority, setPriority] = useState('Medium');
        const [status, setStatus] = useState('Open');
        const [dueDate, setDueDate] = useState('');

        const handleFormSubmit = e => {
            e.preventDefault();
            if (!subject || !project || !category || !assignee || !priority || !status || !dueDate) {
                frappe.msgprint(__('Please fill all mandatory fields.'));
                return;
            }
            onSubmit({ subject, project, category, assignee, priority, status, exp_end_date: dueDate });
        };

        return React.createElement('div', { className: 'pt-modal-backdrop flex items-center justify-center p-4' },
            React.createElement('div', { className: 'bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border text-xs space-y-4 pt-animate-slide-left' },
                React.createElement('div', { className: 'flex justify-between items-center pb-3 border-b' },
                    React.createElement('div', null,
                        React.createElement('h3', { className: 'text-base font-bold text-slate-900' }, 'Create New Task'),
                        React.createElement('p', { className: 'text-[11px] text-slate-500' }, 'ERPNext Task DocType • Mandatory Fields Only')
                    ),
                    React.createElement('button', { onClick: onClose, className: 'text-slate-400 font-bold' }, '✕')
                ),
                React.createElement('form', { onSubmit: handleFormSubmit, className: 'space-y-3.5' },
                    React.createElement('div', null,
                        React.createElement('label', { className: 'font-bold block mb-1' }, 'Subject *'),
                        React.createElement('input', {
                            required: true,
                            value: subject,
                            onChange: e => setSubject(e.target.value),
                            placeholder: 'e.g. Implement Multi-tenant OAuth Auth',
                            className: 'w-full p-2 border rounded-lg text-xs'
                        })
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'font-bold block mb-1' }, 'Project *'),
                        React.createElement('select', {
                            required: true,
                            value: project,
                            onChange: e => setProject(e.target.value),
                            className: 'w-full p-2 border rounded-lg text-xs'
                        },
                            projects.map(p => React.createElement('option', { key: p.name, value: p.name }, `[${p.name}] ${p.project_name}`))
                        )
                    ),
                    React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'font-bold block mb-1' }, 'Category *'),
                            React.createElement('select', {
                                required: true,
                                value: category,
                                onChange: e => setCategory(e.target.value),
                                className: 'w-full p-2 border rounded-lg text-xs'
                            },
                                Object.values(CATEGORIES).map(c => React.createElement('option', { key: c, value: c }, c))
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'font-bold block mb-1' }, 'Assignee *'),
                            React.createElement('input', {
                                required: true,
                                value: assignee,
                                onChange: e => setAssignee(e.target.value),
                                placeholder: 'User email',
                                className: 'w-full p-2 border rounded-lg text-xs'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'font-bold block mb-1' }, 'Priority *'),
                            React.createElement('select', {
                                required: true,
                                value: priority,
                                onChange: e => setPriority(e.target.value),
                                className: 'w-full p-2 border rounded-lg text-xs'
                            },
                                React.createElement('option', { value: 'Urgent' }, '🔥 Urgent'),
                                React.createElement('option', { value: 'High' }, '▲ High'),
                                React.createElement('option', { value: 'Medium' }, '● Medium'),
                                React.createElement('option', { value: 'Low' }, '▽ Low')
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'font-bold block mb-1' }, 'Status *'),
                            React.createElement('select', {
                                required: true,
                                value: status,
                                onChange: e => setStatus(e.target.value),
                                className: 'w-full p-2 border rounded-lg text-xs'
                            },
                                React.createElement('option', { value: 'Open' }, 'Open'),
                                React.createElement('option', { value: 'Working' }, 'Working'),
                                React.createElement('option', { value: 'Completed' }, 'Completed')
                            )
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('label', { className: 'font-bold block mb-1' }, 'Due Date (exp_end_date) *'),
                        React.createElement('input', {
                            type: 'date',
                            required: true,
                            value: dueDate,
                            onChange: e => setDueDate(e.target.value),
                            className: 'w-full p-2 border rounded-lg text-xs'
                        })
                    ),
                    React.createElement('div', { className: 'flex justify-end space-x-2 pt-3 border-t' },
                        React.createElement('button', { type: 'button', onClick: onClose, className: 'px-4 py-2 border rounded-lg' }, 'Cancel'),
                        React.createElement('button', { type: 'submit', className: 'px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg' }, 'Save to ERPNext Task')
                    )
                )
            )
        );
    }

    const root = ReactDOM.createRoot(domNode);
    root.render(React.createElement(ProjectTrackerApp));
}
