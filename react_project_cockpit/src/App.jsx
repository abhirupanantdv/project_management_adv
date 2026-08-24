import React, { useState, useEffect, useMemo } from 'react';
import { initialProjects, initialActivities, calculateProjectProgress, flattenTasks } from './data/initialData.js';
import ProjectCard from './components/projects/ProjectCard.jsx';
import ProjectDetailsPage from './components/projects/ProjectDetailsPage.jsx';
import UrgentNotificationDrawer from './components/notifications/UrgentNotificationDrawer.jsx';
import { ERPNextService } from './services/erpnextApi.js';

export default function App() {
  // 40 Projects persisted in localStorage
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('erpnext_projects_40_v1');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('erpnext_activities_40_v1');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('erpnext_api_config');
    return saved ? JSON.parse(saved) : {
      baseUrl: 'http://192.168.101.125',
      apiKey: '',
      apiSecret: '',
      isLive: false
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Navigation State: 'projects_list' | 'project_details'
  const [currentPage, setCurrentPage] = useState('projects_list');
  const [selectedProjectId, setSelectedProjectId] = useState('PROJ-0001');

  // Pagination: Initially show first 10 projects
  const [visibleCount, setVisibleCount] = useState(10);

  // Global Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [notification, setNotification] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [targetProjectForNewTask, setTargetProjectForNewTask] = useState('PROJ-0001');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isUrgentDrawerOpen, setIsUrgentDrawerOpen] = useState(false);

  // Dark mode sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Persist State
  useEffect(() => {
    localStorage.setItem('erpnext_projects_40_v1', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('erpnext_activities_40_v1', JSON.stringify(activities));
  }, [activities]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Helper: Open Dedicated Project Details Page
  const handleOpenProjectDetails = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project_details');
    setIsUrgentDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate all active urgent tasks across all projects
  const urgentTasks = useMemo(() => {
    const list = [];
    projects.forEach(p => {
      const flat = flattenTasks(p.tasks || []);
      flat.forEach(t => {
        if (t.priority === 'Urgent' && t.status !== 'Completed') {
          list.push({
            ...t,
            projectId: p.id,
            projectName: p.name,
            projectCompany: p.company
          });
        }
      });
    });
    return list;
  }, [projects]);

  // Unique assignees with urgent tasks
  const uniqueUrgentAssignees = useMemo(() => {
    const set = new Set();
    urgentTasks.forEach(t => {
      const name = typeof t.assignee === 'object' ? t.assignee?.name : t.assignee || 'Unassigned';
      set.add(name);
    });
    return Array.from(set);
  }, [urgentTasks]);

  // Dispatch notification to a specific assigned person
  const handleNotifyPerson = (assigneeName, task, isCopyOnly = false, isBulkForPerson = false) => {
    if (isCopyOnly) {
      showToast(`📋 Copied urgent alert message for ${assigneeName} to clipboard!`, 'success');
      return;
    }

    const taskLabel = task.name || task.subject || 'Urgent Task';
    const projLabel = task.projectId ? ` (${task.projectId})` : '';

    if (isBulkForPerson) {
      showToast(`🚨 Urgent ping sent to @${assigneeName} for all assigned urgent tasks!`, 'warning');
      const newAct = {
        id: `ACT-${Date.now()}`,
        user: "System Watchdog",
        action: `sent urgent priority notification to @${assigneeName}`,
        target: `${assigneeName}'s urgent tasks`,
        time: "Just now",
        avatar: "🚨"
      };
      setActivities(prev => [newAct, ...prev]);
    } else {
      showToast(`🚨 Urgent alert dispatched to @${assigneeName} for "${taskLabel}"${projLabel}!`, 'warning');
      const newAct = {
        id: `ACT-${Date.now()}`,
        user: "System Watchdog",
        action: `dispatched urgent alert to @${assigneeName}`,
        target: `Task: ${taskLabel}`,
        time: "Just now",
        avatar: "⚡"
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  // Dispatch broadcast notification to all assignees
  const handleNotifyAll = () => {
    if (urgentTasks.length === 0) return;
    const names = uniqueUrgentAssignees.join(', ');
    showToast(`📢 Urgent notifications broadcasted to ${uniqueUrgentAssignees.length} assignees (${names})!`, 'warning');

    const newAct = {
      id: `ACT-${Date.now()}`,
      user: "Executive Lead",
      action: `broadcasted urgent task alerts to all assignees`,
      target: `${urgentTasks.length} urgent tasks (${names})`,
      time: "Just now",
      avatar: "📢"
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Task Status Change in Tree / Details
  const handleTaskStatusChange = (projectId, taskId, newStatus) => {
    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        function updateNode(node) {
          if (node.id === taskId) {
            const newProg = newStatus === 'Completed' ? 100 : (newStatus === 'In Progress' ? 50 : 0);
            return { ...node, status: newStatus, progress: newProg };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: node.children.map(updateNode) };
          }
          return node;
        }

        const updatedTasks = (proj.tasks || []).map(updateNode);
        const allFlat = flattenTasks(updatedTasks);
        const comp = allFlat.filter(t => t.status === 'Completed').length;
        const calcProgress = allFlat.length > 0 ? Math.round((comp / allFlat.length) * 100) : proj.percentCompleted;

        let newProjStatus = proj.status;
        if (calcProgress === 100) {
          newProjStatus = 'Completed';
        } else if (calcProgress > 0) {
          newProjStatus = 'In Progress';
        } else {
          newProjStatus = 'Not Started';
        }

        return {
          ...proj,
          percentCompleted: calcProgress,
          status: newProjStatus,
          tasks: updatedTasks
        };
      });
    });

    showToast(`Task status updated to "${newStatus}". Overall progress recalculated!`);
  };

  // Task Priority Change
  const handleTaskPriorityChange = (projectId, taskId, newPriority) => {
    let taskName = '';
    let assignee = '';

    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        function updateNode(node) {
          if (node.id === taskId) {
            taskName = node.name || node.subject;
            assignee = typeof node.assignee === 'object' ? node.assignee?.name : node.assignee || 'Unassigned';
            return { ...node, priority: newPriority };
          }
          if (node.children && node.children.length > 0) {
            return { ...node, children: node.children.map(updateNode) };
          }
          return node;
        }

        return {
          ...proj,
          tasks: (proj.tasks || []).map(updateNode)
        };
      });
    });

    if (newPriority === 'Urgent') {
      showToast(`🔥 Priority escalated to URGENT for "${taskName}"! Notification sent to @${assignee}.`, 'warning');
    } else {
      showToast(`Task priority updated to ${newPriority}.`);
    }
  };

  // Add Task to Project
  const handleAddTask = (newTaskData) => {
    const pId = newTaskData.projectId || selectedProjectId;
    const assigneeName = newTaskData.assignee || 'Unassigned';
    const newTask = {
      id: `TASK-${Date.now().toString().slice(-4)}`,
      name: newTaskData.name || newTaskData.subject,
      category: newTaskData.category || 'Development',
      status: newTaskData.status || 'Not Started',
      priority: newTaskData.priority || 'Medium',
      progress: newTaskData.status === 'Completed' ? 100 : 0,
      dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
      assignee: { name: assigneeName, avatar: assigneeName.slice(0, 2).toUpperCase() },
      children: []
    };

    setProjects(prev => {
      return prev.map(p => {
        if (p.id !== pId) return p;
        const updated = [...(p.tasks || []), newTask];
        const flat = flattenTasks(updated);
        const comp = flat.filter(t => t.status === 'Completed').length;
        const prog = Math.round((comp / flat.length) * 100);
        return {
          ...p,
          percentCompleted: prog,
          tasks: updated
        };
      });
    });

    setIsNewTaskModalOpen(false);

    if (newTaskData.priority === 'Urgent') {
      showToast(`🚨 Urgent task created! Instant notification sent to @${assigneeName}.`, 'warning');
      const newAct = {
        id: `ACT-${Date.now()}`,
        user: "System",
        action: `created urgent task & alerted @${assigneeName}`,
        target: newTask.name,
        time: "Just now",
        avatar: "🚨"
      };
      setActivities(prev => [newAct, ...prev]);
    } else {
      showToast(`Task created under ${pId}!`);
    }
  };

  // Add Project
  const handleAddProject = (newProjData) => {
    const newId = `PROJ-${String(projects.length + 1).padStart(4, '0')}`;
    const newProj = {
      id: newId,
      name: newProjData.name,
      company: newProjData.company || 'Enterprise',
      status: 'Not Started',
      priority: newProjData.priority || 'Medium',
      owner: newProjData.owner || 'Admin',
      startDate: newProjData.startDate || new Date().toISOString().split('T')[0],
      dueDate: newProjData.dueDate || '',
      creation: new Date().toISOString().split('T')[0],
      assignedTeamCount: 1,
      budget: Number(newProjData.budget) || 50000,
      actualCost: 0,
      percentCompleted: 0,
      assignedUsers: [{ name: newProjData.owner || 'Admin', avatar: 'AD', role: 'Lead', color: 'from-indigo-500 to-purple-600' }],
      tasks: []
    };

    setProjects([newProj, ...projects]);
    setIsNewProjectModalOpen(false);
    showToast(`Project ${newId} created successfully!`);
  };

  // Filtered Projects List
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.owner && p.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.company && p.company.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || p.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [projects, searchTerm, statusFilter, priorityFilter]);

  // Paginated Projects (First 10, then +10 on Load More)
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMoreProjects = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, filteredProjects.length));
  };

  // Current Selected Project for Details Page
  const currentSelectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Overall Global KPIs
  const globalKpis = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const notStarted = projects.filter(p => p.status === 'Not Started').length;
    const allFlat = projects.flatMap(p => flattenTasks(p.tasks || []));
    const allTasksCount = allFlat.length;
    const compTasksCount = allFlat.filter(t => t.status === 'Completed').length;
    const overallProgress = allTasksCount > 0 ? Math.round((compTasksCount / allTasksCount) * 100) : 0;

    return { total, completed, inProgress, notStarted, allTasksCount, compTasksCount, overallProgress };
  }, [projects]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 antialiased font-sans pb-16">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md transition-all transform animate-bounce ${
          notification.type === 'error' ? 'bg-rose-600/95 text-white' :
          notification.type === 'warning' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white ring-2 ring-rose-400' :
          'bg-indigo-600/95 text-white'
        }`}>
          <span className="text-lg">
            {notification.type === 'error' ? '⚠️' : notification.type === 'warning' ? '🚨' : '✅'}
          </span>
          <span className="text-xs md:text-sm font-bold tracking-wide">{notification.msg}</span>
        </div>
      )}

      {/* Urgent Notifications Drawer */}
      <UrgentNotificationDrawer
        isOpen={isUrgentDrawerOpen}
        onClose={() => setIsUrgentDrawerOpen(false)}
        urgentTasks={urgentTasks}
        onNotifyPerson={handleNotifyPerson}
        onNotifyAll={handleNotifyAll}
        onNavigateToProject={handleOpenProjectDetails}
      />

      {/* Top Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo & View Switcher */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('projects_list')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black font-display tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Project Cockpit
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-md">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Modern Project & Multi-Level Task Management Dashboard
                </p>
              </div>
            </div>

            {/* Global Actions & Urgent Notifications Bell */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Urgent Notifications Bell Button */}
              <button
                onClick={() => setIsUrgentDrawerOpen(true)}
                className={`relative p-2 rounded-xl border transition-all flex items-center justify-center ${
                  urgentTasks.length > 0
                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400 hover:bg-rose-100 ring-2 ring-rose-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
                title="Urgent Task Notifications Center"
              >
                <span className="text-base">🔔</span>
                {urgentTasks.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-black rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {urgentTasks.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
              >
                <span>+</span>
                <span className="hidden sm:inline">New Project</span>
              </button>

              <button
                onClick={() => {
                  setTargetProjectForNewTask(selectedProjectId);
                  setIsNewTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Task</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark / Light Theme"
                className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-all text-sm"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ============================================================ */}
        {/* VIEW 1: DEDICATED FULL-PAGE PROJECT DETAILS VIEW             */}
        {/* ============================================================ */}
        {currentPage === 'project_details' ? (
          <ProjectDetailsPage
            project={currentSelectedProject}
            onBack={() => setCurrentPage('projects_list')}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskPriorityChange={handleTaskPriorityChange}
            onAddTaskClick={(pId) => {
              setTargetProjectForNewTask(pId);
              setIsNewTaskModalOpen(true);
            }}
            onNotifyAssignee={handleNotifyPerson}
            apiConfig={apiConfig}
          />
        ) : (

        /* ============================================================ */}
        /* VIEW 2: PROJECT LIST PAGE (40 PROJECTS WITH LOAD MORE)       */}
        /* ============================================================ */
          <div className="space-y-6">
            
            {/* 🚨 URGENT TASKS NOTIFICATION BANNER */}
            {urgentTasks.length > 0 && (
              <div className="bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-transparent dark:from-rose-950/40 dark:via-amber-950/20 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-600/30 animate-pulse">
                    🚨
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-rose-950 dark:text-rose-200">
                        {urgentTasks.length} Urgent Tasks Pending Action
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-rose-600 text-white">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
                      Assigned to <strong className="font-bold">{uniqueUrgentAssignees.join(', ')}</strong>. Send direct notifications to ensure priority execution.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsUrgentDrawerOpen(true)}
                    className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 hover:bg-rose-50 text-rose-700 dark:text-rose-300 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🔔</span>
                    <span>Review & Notify</span>
                  </button>

                  <button
                    onClick={handleNotifyAll}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📢</span>
                    <span>Notify All Assignees</span>
                  </button>
                </div>
              </div>
            )}

            {/* Global Executive Metric Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Total Projects</span>
                  <span className="text-base">📁</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                    {globalKpis.total}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {globalKpis.inProgress} active
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {globalKpis.completed} Completed • {globalKpis.notStarted} Not Started
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Overall Progress</span>
                  <span className="text-base">🎯</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-display text-emerald-600 dark:text-emerald-400">
                    {globalKpis.overallProgress}%
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    Rollup
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${globalKpis.overallProgress}%` }}></div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Total Tasks Tree</span>
                  <span className="text-base">✅</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                    {globalKpis.allTasksCount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    ({globalKpis.compTasksCount} done)
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Nested Parent & Subtasks
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Urgent Bottlenecks</span>
                  <span className="text-base">🔥</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl sm:text-3xl font-black font-display ${urgentTasks.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {urgentTasks.length}
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    Urgent Tasks
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {uniqueUrgentAssignees.length} Assignees Pending Notification
                </div>
              </div>

            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                <div className="relative flex-1 min-w-[240px]">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search 40 projects by name, ID, owner, company..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setVisibleCount(10);
                    }}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">✕</button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setVisibleCount(10);
                    }}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="All">All Statuses ({projects.length})</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Started">Not Started</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => {
                      setPriorityFilter(e.target.value);
                      setVisibleCount(10);
                    }}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">🔥 Urgent Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Section Header: Showing X of 40 Projects */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{visibleProjects.length}</strong> of <strong className="text-slate-900 dark:text-white">{filteredProjects.length}</strong> Projects
              </span>
              <span>Click any project card to open dedicated Project Details</span>
            </div>

            {/* Projects Grid (Responsive 1-col mobile, 2-col tablet, 3-col desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleProjects.map(proj => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onOpenProject={handleOpenProjectDetails}
                />
              ))}
            </div>

            {/* Load More Button Section */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl text-center space-y-3 shadow-xs">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Displaying <strong>{visibleProjects.length}</strong> / <strong>{filteredProjects.length}</strong> Projects ({Math.round((visibleProjects.length / (filteredProjects.length || 1)) * 100)}%)
              </div>

              <div className="max-w-xs mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((visibleProjects.length / (filteredProjects.length || 1)) * 100)}%` }}
                ></div>
              </div>

              {hasMoreProjects ? (
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>⬇️</span>
                  <span>Load More Projects (+10 Next)</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px]">
                    {visibleCount} → {Math.min(visibleCount + 10, filteredProjects.length)}
                  </span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl">
                  <span>✅</span>
                  <span>All {filteredProjects.length} Projects Displayed</span>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: ADD TASK MODAL */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Task to Project</h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddTask({
                projectId: e.target.projectId.value,
                name: e.target.subject.value,
                category: e.target.category.value,
                priority: e.target.priority.value,
                status: e.target.status.value,
                assignee: e.target.assignee.value,
                dueDate: e.target.dueDate.value
              });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Target Project</label>
                <select name="projectId" defaultValue={targetProjectForNewTask} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Task Name / Subject</label>
                <input required name="subject" placeholder="e.g. Implement OAuth2 API Gateway" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select name="category" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-semibold">
                    <option value="Development">💻 Development</option>
                    <option value="UI">🎨 UI</option>
                    <option value="Migration">🔄 Migration</option>
                    <option value="Testing">🧪 Testing</option>
                    <option value="Documentation">📄 Documentation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select name="priority" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">🔥 Urgent (Sends notification to assignee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Initial Status</label>
                  <select name="status" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Assignee Person</label>
                  <input name="assignee" defaultValue="Niranjan Singh" placeholder="e.g. Niranjan Singh" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
                <input name="dueDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PROJECT MODAL */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Create New Enterprise Project</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddProject({
                name: e.target.name.value,
                company: e.target.company.value,
                priority: e.target.priority.value,
                owner: e.target.owner.value,
                startDate: e.target.startDate.value,
                dueDate: e.target.dueDate.value,
                budget: e.target.budget.value
              });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Project Name</label>
                <input required name="name" placeholder="e.g. ADV-Global Cloud Suite" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Company / Customer</label>
                  <input name="company" defaultValue="Anantdv" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select name="priority" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Project Owner</label>
                  <input name="owner" placeholder="e.g. Niranjan Singh" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Budget ($)</label>
                  <input name="budget" type="number" defaultValue="65000" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                  <input name="startDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
                  <input name="dueDate" type="date" className="w-full p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
