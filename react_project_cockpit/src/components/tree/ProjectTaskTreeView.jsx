import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../data/initialData.js';

export default function ProjectTaskTreeView({
  projects,
  selectedProjectId,
  onSelectProjectId,
  onTaskStatusChange,
  onTaskPriorityChange,
  onAddTaskClick,
  onOpenDetails
}) {
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active selected project
  const activeProjectId = selectedProjectId || (projects[0] ? projects[0].id : '');
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const tasks = activeProject?.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const workingTasks = tasks.filter(t => t.status === 'Working' || t.status === 'In Progress').length;
  const openTasks = tasks.filter(t => t.status === 'Open').length;

  // Real-time calculated progress: Completed Tasks ÷ Total Tasks × 100
  const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Extract unique assigned members from tasks
  const taskAssignees = useMemo(() => {
    const map = new Map();
    (activeProject?.assignedUsers || []).forEach(u => {
      map.set(u.name, { name: u.name, email: u.email, avatar: u.avatar || u.name.slice(0, 2).toUpperCase() });
    });
    tasks.forEach(t => {
      if (t.assignee && t.assignee !== 'Unassigned' && !map.has(t.assignee)) {
        const cleanName = t.assignee.replace(/[._]/g, ' ');
        const avatar = cleanName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        map.set(t.assignee, { name: t.assignee, email: '', avatar: avatar || 'US' });
      }
    });
    return Array.from(map.values());
  }, [activeProject, tasks]);

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const groups = {};
    Object.values(CATEGORIES).forEach(cat => {
      groups[cat] = tasks.filter(t => (t.category || 'Development') === cat);
    });
    return groups;
  }, [tasks]);

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filter projects in combobox
  const filteredProjectsList = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.customer && p.customer.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const statusStyles = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    'Working': 'bg-blue-50 text-blue-700 border-blue-200/80',
    'Open': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const priorityStyles = {
    'Urgent': 'text-rose-700 bg-rose-50 border-rose-200',
    'High': 'text-amber-700 bg-amber-50 border-amber-200',
    'Medium': 'text-slate-700 bg-slate-100 border-slate-200',
    'Low': 'text-slate-600 bg-slate-50 border-slate-200'
  };

  if (!activeProject) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No projects available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* 1. PROFESSIONAL EXECUTIVE PROJECT COMMAND BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          {/* Left: Custom Project Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5 font-sans">
              ACTIVE ERPNEXT PROJECT
            </span>

            {/* Custom Interactive Switcher Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-white transition-all text-left shadow-xs group min-w-[280px] sm:min-w-[360px]"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                🏢
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.2 rounded">
                    {activeProject.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {activeProject.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Customer: <strong className="text-slate-700 font-medium">{activeProject.customer || 'Enterprise'}</strong>
                </p>
              </div>

              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-xs shrink-0 group-hover:text-indigo-600 transition">
                ▾
              </div>
            </button>

            {/* Custom Searchable Popover Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-[420px] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 animate-slide-left">
                {/* Search box */}
                <div className="p-2 border-b border-slate-100 mb-1">
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects or customers..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                  {filteredProjectsList.map(p => {
                    const isSelected = p.id === activeProject.id;
                    const pTasks = p.tasks?.length || 0;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProjectId(p.id);
                          setIsDropdownOpen(false);
                          setProjectSearch('');
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-indigo-50/70 border border-indigo-100' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] font-bold text-indigo-600 bg-white border border-indigo-100 px-1.5 py-0.5 rounded">
                              {p.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {p.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            🏢 {p.customer || 'Enterprise'}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {p.status}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                            {pTasks} {pTasks === 1 ? 'task' : 'tasks'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Action Controls & Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Metadata Pills */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyles[activeProject.status] || statusStyles['Open']}`}>
                ● {activeProject.status}
              </span>
              <span className="text-slate-300">|</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${priorityStyles[activeProject.priority] || priorityStyles['Medium']}`}>
                {activeProject.priority}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">
                🎯 Due: <strong className="text-slate-900">{activeProject.expectedEndDate || '—'}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => onAddTaskClick(activeProject.id)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm hover:shadow flex items-center space-x-1.5"
            >
              <span>+</span>
              <span>Create Task</span>
            </button>

            {onOpenDetails && (
              <button
                onClick={() => onOpenDetails(activeProject)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition"
              >
                Project Details ↗
              </button>
            )}
          </div>

        </div>

        {/* Live Calculated Progress Bar Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-semibold mb-2">
            <span className="text-slate-800">
              Overall Completion: <strong className="text-sm font-bold text-slate-900">{calculatedProgress}%</strong>
              {totalTasks === 0 ? (
                <span className="text-amber-600 font-bold ml-2"> (0 tasks linked — 0% progress)</span>
              ) : (
                <span className="text-slate-500 font-normal"> ({completedTasks} of {totalTasks} Tasks Completed)</span>
              )}
            </span>

            {/* Assigned Avatars */}
            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
              <span className="text-slate-400 text-[11px]">Team:</span>
              <div className="flex -space-x-1.5 overflow-hidden">
                {taskAssignees.map((user, uIdx) => (
                  <div
                    key={uIdx}
                    title={user.name}
                    className="w-6 h-6 rounded-full text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 flex items-center justify-center ring-2 ring-white shadow-xs"
                  >
                    {user.avatar}
                  </div>
                ))}
                {taskAssignees.length === 0 && (
                  <span className="text-slate-400 text-xs">Unassigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${calculatedProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY PROGRESS SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.values(CATEGORIES).map(cat => {
          const conf = CATEGORY_CONFIG[cat];
          const catTasks = tasksByCategory[cat] || [];
          const catTotal = catTasks.length;
          const catComp = catTasks.filter(t => t.status === 'Completed').length;
          const catPct = catTotal > 0 ? Math.round((catComp / catTotal) * 100) : 0;

          return (
            <div
              key={cat}
              onClick={() => toggleCategoryCollapse(cat)}
              className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition cursor-pointer text-xs select-none"
            >
              <div className="flex justify-between items-center font-bold mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <span>{conf.icon}</span>
                  <span className="text-slate-800 font-semibold">{cat}</span>
                </span>
                <span className="text-slate-900 font-black">{catPct}%</span>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1.5">
                <div className={`${conf.barColor} h-full rounded-full transition-all`} style={{ width: `${catPct}%` }}></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{catTotal === 0 ? '0 Tasks' : `${catComp}/${catTotal} Done`}</span>
                <span>{collapsedCategories[cat] ? '▼' : '▲'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ZERO TASK EMPTY STATE (If project has 0 tasks) */}
      {totalTasks === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
            📋
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            No Tasks Created for [{activeProject.id}] {activeProject.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            This project has 0 tasks. Add tasks categorized under Development, UI, Migration, Testing, or Documentation to begin tracking live progress.
          </p>
          <button
            onClick={() => onAddTaskClick(activeProject.id)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition inline-flex items-center space-x-1.5"
          >
            <span>+</span>
            <span>Create First Task</span>
          </button>
        </div>
      )}

      {/* 4. HIERARCHICAL CATEGORY TASK TREE VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Tree Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>🌲</span>
              <span>Project Task Tree Hierarchy</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                {totalTasks} Tasks
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Grouped by Category with Assignee, Due Date, and Priority
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setCollapsedCategories({})}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Expand All
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                const all = {};
                Object.values(CATEGORIES).forEach(c => all[c] = true);
                setCollapsedCategories(all);
              }}
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Tree Nodes */}
        <div className="divide-y divide-slate-100">
          {Object.values(CATEGORIES).map(categoryName => {
            const conf = CATEGORY_CONFIG[categoryName];
            const catTasks = tasksByCategory[categoryName] || [];
            const catTotal = catTasks.length;
            const catComp = catTasks.filter(t => t.status === 'Completed').length;
            const catPct = catTotal > 0 ? Math.round((catComp / catTotal) * 100) : 0;
            const isCollapsed = collapsedCategories[categoryName];

            return (
              <div key={categoryName} className="p-4 sm:p-5">
                
                {/* Branch Node Header */}
                <div
                  onClick={() => toggleCategoryCollapse(categoryName)}
                  className="flex items-center justify-between cursor-pointer group select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                      {isCollapsed ? '▶' : '▼'}
                    </span>

                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${conf.bgClass}`}>
                      <span>{conf.icon}</span>
                      <span>{categoryName}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-800">
                      {catTotal} {catTotal === 1 ? 'Task' : 'Tasks'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-24 sm:w-36 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div className={`${conf.barColor} h-full rounded-full transition-all`} style={{ width: `${catPct}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {catTotal === 0 ? '0%' : `${catComp}/${catTotal} (${catPct}%)`}
                    </span>
                  </div>
                </div>

                {/* Leaf Task Items */}
                {!isCollapsed && (
                  <div className="mt-3.5 pl-4 sm:pl-9 space-y-2 border-l-2 border-slate-100 ml-3">
                    {catTasks.length === 0 ? (
                      <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                        <span>No {categoryName} tasks in this project.</span>
                        <button
                          onClick={() => onAddTaskClick(activeProject.id)}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          + Add {categoryName} Task
                        </button>
                      </div>
                    ) : (
                      catTasks.map(task => {
                        const isDone = task.status === 'Completed';
                        const isWorking = task.status === 'Working' || task.status === 'In Progress';

                        return (
                          <div
                            key={task.id}
                            className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs shadow-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-indigo-600">
                                  {task.id}
                                </span>
                                <h4 className={`font-semibold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                                  {task.subject}
                                </h4>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                                <span>👤 Assignee: <strong className="text-slate-700">{task.assignee || 'Unassigned'}</strong></span>
                                <span>•</span>
                                <span>📅 Due Date: <strong className="text-slate-700">{task.exp_end_date || task.expectedEndDate || '—'}</strong></span>
                                <span>•</span>
                                
                                {/* Interactive Priority Selector */}
                                <select
                                  value={task.priority || 'Medium'}
                                  onChange={(e) => onTaskPriorityChange && onTaskPriorityChange(activeProject.id, task.id, e.target.value)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                                    task.priority === 'Urgent'
                                      ? 'text-rose-700 bg-rose-50 border-rose-200'
                                      : task.priority === 'High'
                                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                                      : 'text-slate-700 bg-slate-100 border-slate-200'
                                  }`}
                                  title="Click to change Priority"
                                >
                                  <option value="Urgent">🔥 Urgent</option>
                                  <option value="High">▲ High</option>
                                  <option value="Medium">● Medium</option>
                                  <option value="Low">▽ Low</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (isWorking ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200')
                              }`}>
                                {task.status}
                              </span>

                              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-[10px]">
                                {!isWorking && !isDone && (
                                  <button
                                    onClick={() => onTaskStatusChange(activeProject.id, task.id, 'Working')}
                                    className="px-2 py-0.5 rounded font-semibold text-blue-700 hover:bg-white transition"
                                  >
                                    Work
                                  </button>
                                )}
                                {!isDone ? (
                                  <button
                                    onClick={() => onTaskStatusChange(activeProject.id, task.id, 'Completed')}
                                    className="px-2 py-0.5 rounded font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                                  >
                                    Done
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onTaskStatusChange(activeProject.id, task.id, 'Open')}
                                    className="px-2 py-0.5 rounded font-semibold text-slate-600 hover:bg-white transition"
                                  >
                                    Reopen
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
