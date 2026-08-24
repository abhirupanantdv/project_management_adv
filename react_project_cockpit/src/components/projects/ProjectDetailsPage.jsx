import React, { useState, useMemo } from 'react';
import { CATEGORY_CONFIG, flattenTasks } from '../../data/initialData.js';

export default function ProjectDetailsPage({
  project,
  onBack,
  onTaskStatusChange,
  onTaskPriorityChange,
  onAddTaskClick
}) {
  const [taskLayoutMode, setTaskLayoutMode] = useState('grid'); // 'grid' (default) | 'list'
  const [collapsedCategories, setCollapsedCategories] = useState({});

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-lg font-bold">Project Not Found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-xs"
        >
          ← Return to Projects List
        </button>
      </div>
    );
  }

  const allTasks = useMemo(() => {
    return flattenTasks(project.tasks || []);
  }, [project.tasks]);

  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter(t => t.status === 'Completed').length;
  const workingTasksCount = allTasks.filter(t => t.status === 'Working' || t.status === 'In Progress').length;
  const openTasksCount = totalTasksCount - completedTasksCount - workingTasksCount;

  const overallPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : (project.percentCompleted || 0);

  // Group tasks by 5 categories
  const categoriesList = ["Development", "UI", "Migration", "Testing", "Documentation"];

  const categoryData = useMemo(() => {
    return categoriesList.map(catKey => {
      const catConfig = CATEGORY_CONFIG[catKey] || CATEGORY_CONFIG['Development'];
      const tasksInCat = allTasks.filter(t => (t.category || 'Development') === catKey);
      const doneCount = tasksInCat.filter(t => t.status === 'Completed').length;
      const totalCount = tasksInCat.length;
      const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

      return {
        key: catKey,
        label: catConfig.label,
        icon: catConfig.icon,
        bgClass: catConfig.bgClass,
        barColor: catConfig.barColor,
        tasks: tasksInCat,
        doneCount,
        totalCount,
        pct
      };
    });
  }, [allTasks]);

  const toggleCategory = (catKey) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  const expandAll = () => setCollapsedCategories({});
  const collapseAll = () => {
    const all = {};
    categoriesList.forEach(k => { all[k] = true; });
    setCollapsedCategories(all);
  };

  // Priority Styles
  const priorityStyles = {
    'Urgent': 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    'High': 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'Medium': 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Low': 'bg-slate-50 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };

  const assignedUsers = project.assignedUsers && project.assignedUsers.length > 0
    ? project.assignedUsers
    : [
        { name: "Niranjan Singh", avatar: "NS" },
        { name: "Dipanwita", avatar: "DP" },
        { name: "Tanuja", avatar: "TD" },
        { name: "Sushmita", avatar: "SB" }
      ];

  return (
    <div className="space-y-5 animate-fade-in font-sans">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-xs"
          >
            <span>←</span>
            <span>Back to Projects List</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {project.id}
          </span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs truncate max-w-md">
            {project.name}
          </span>
        </div>

        <button
          onClick={() => onAddTaskClick && onAddTaskClick(project.id)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 1. OVERALL COMPLETION HEADER & PROGRESS BAR                  */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Overall Completion: <strong className="font-black text-slate-900 dark:text-white">{overallPercent}%</strong>
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{completedTasksCount} Done</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{workingTasksCount} Working</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">{openTasksCount} Open</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Project Lead: <strong className="text-slate-700 dark:text-slate-300">{project.owner || 'Admin'}</strong> • Due Date: <strong className="text-slate-700 dark:text-slate-300">{project.dueDate || 'N/A'}</strong>
            </p>
          </div>

          {/* Assigned Members Avatar Stack */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Assigned Members:
            </span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {assignedUsers.map((u, i) => (
                <div
                  key={i}
                  title={u.name}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-bold text-white bg-indigo-600 ring-2 ring-white dark:ring-slate-900 shadow-2xs"
                >
                  {u.avatar || u.name?.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Full-Width Gradient Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600"
            style={{ width: `${overallPercent}%` }}
          ></div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 5-CATEGORY PROGRESS SUMMARY STRIP                         */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryData.map(cat => {
          const isCollapsed = !!collapsedCategories[cat.key];

          return (
            <div
              key={cat.key}
              onClick={() => toggleCategory(cat.key)}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{cat.icon}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {cat.label}
                  </span>
                </div>
                <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                  {cat.pct}%
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.key === 'Development' ? 'bg-indigo-600' :
                    cat.key === 'UI' ? 'bg-purple-600' :
                    cat.key === 'Migration' ? 'bg-amber-500' :
                    cat.key === 'Testing' ? 'bg-emerald-600' :
                    'bg-sky-500'
                  }`}
                  style={{ width: `${cat.pct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span>{cat.doneCount}/{cat.totalCount} Done</span>
                <span className="text-[10px] text-slate-400">
                  {isCollapsed ? '▲' : '▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 3. PROJECT TASK TREE HIERARCHY SECTION                       */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🌲</span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Project Task Tree Hierarchy
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {totalTasksCount} Total Tasks
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Task Color Legend: 🟢 <strong className="text-emerald-700 dark:text-emerald-400">Completed (Light Green)</strong> • 🟡 <strong className="text-amber-700 dark:text-amber-400">Working (Yellow)</strong> • 🔴 <strong className="text-rose-700 dark:text-rose-400">Open (Light Red)</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle: Grid View (Default) vs Row List View */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setTaskLayoutMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                  taskLayoutMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>📊</span>
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setTaskLayoutMode('list')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all ${
                  taskLayoutMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>📑</span>
                <span>List View</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <button onClick={expandAll} className="hover:underline cursor-pointer">
                Expand All
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button onClick={collapseAll} className="hover:underline cursor-pointer">
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. CATEGORY COLLAPSIBLE SECTIONS WITH TASK COLOR CODING      */}
        {/* Completed = Green | Working = Yellow | Open = Light Red       */}
        {/* ============================================================ */}
        <div className="space-y-4">
          {categoryData.map(cat => {
            const isCollapsed = !!collapsedCategories[cat.key];

            return (
              <div
                key={cat.key}
                className="border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs"
              >
                {/* Category Header Row */}
                <div
                  onClick={() => toggleCategory(cat.key)}
                  className="bg-slate-50/90 dark:bg-slate-800/60 px-4 py-3 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 text-xs font-bold">
                      {isCollapsed ? '▶' : '▼'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-md border ${cat.bgClass}`}>
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {cat.totalCount} tasks
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 sm:w-28 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full transition-all ${
                          cat.key === 'Development' ? 'bg-indigo-600' :
                          cat.key === 'UI' ? 'bg-purple-600' :
                          cat.key === 'Migration' ? 'bg-amber-500' :
                          cat.key === 'Testing' ? 'bg-emerald-600' :
                          'bg-sky-500'
                        }`}
                        style={{ width: `${cat.pct}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {cat.doneCount}/{cat.totalCount} ({cat.pct}%)
                    </span>
                  </div>
                </div>

                {/* Tasks Content inside Category */}
                {!isCollapsed && (
                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900">
                    {cat.tasks.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 italic">
                        No tasks in {cat.label}
                      </div>
                    ) : taskLayoutMode === 'grid' ? (

                      /* ============================================================ */
                      /* 📊 TASK GRID VIEW (Green / Yellow / Light Red)               */
                      /* ============================================================ */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {cat.tasks.map(task => {
                          const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
                          const isCompleted = task.status === 'Completed';
                          const isWorking = task.status === 'Working' || task.status === 'In Progress';
                          const isOpen = !isCompleted && !isWorking;

                          // Task Card Colors:
                          // Completed = Light Green | Working = Yellow | Open = Light Red
                          const cardBg = isCompleted
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400/20 shadow-xs'
                            : isWorking
                            ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-300 dark:border-amber-700 ring-1 ring-amber-400/20 shadow-xs'
                            : 'bg-rose-50/50 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/20 shadow-xs';

                          const titleColor = isCompleted
                            ? 'text-emerald-900 dark:text-emerald-200'
                            : isWorking
                            ? 'text-amber-950 dark:text-amber-200'
                            : 'text-rose-950 dark:text-rose-200';

                          return (
                            <div
                              key={task.id}
                              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${cardBg}`}
                            >
                              {/* Top: ID & Priority */}
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded border ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                  isWorking ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                  'bg-rose-100 text-rose-800 border-rose-300'
                                }`}>
                                  {task.id}
                                </span>

                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border ${priorityStyles[task.priority] || priorityStyles['Medium']}`}>
                                  {task.priority === 'Urgent' && '🔥 Urgent'}
                                  {task.priority === 'High' && '▲ High'}
                                  {task.priority === 'Medium' && '● Medium'}
                                  {task.priority === 'Low' && '▽ Low'}
                                </span>
                              </div>

                              {/* Task Title */}
                              <h4 className={`text-xs sm:text-sm font-extrabold line-clamp-2 flex items-center gap-1.5 ${titleColor}`}>
                                {isCompleted && <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✅</span>}
                                {isWorking && <span className="text-amber-600 dark:text-amber-400 shrink-0">⚡</span>}
                                {isOpen && <span className="text-rose-600 dark:text-rose-400 shrink-0">📌</span>}
                                <span>{task.name || task.subject}</span>
                              </h4>

                              {/* Metadata: Assignee & Due Date */}
                              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
                                  <span>👤</span>
                                  <strong className="text-slate-800 dark:text-slate-200 truncate">{assigneeName}</strong>
                                </span>
                                <span className="flex items-center gap-1 font-mono">
                                  <span>📅</span>
                                  <strong className="text-slate-800 dark:text-slate-200">{task.dueDate || 'N/A'}</strong>
                                </span>
                              </div>

                              {/* Action Footer */}
                              <div className="flex items-center justify-between pt-1">
                                <div>
                                  {isCompleted && (
                                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Completed
                                    </span>
                                  )}
                                  {isWorking && (
                                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                                      Working
                                    </span>
                                  )}
                                  {isOpen && (
                                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                                      Open
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {isCompleted && (
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Working')}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                                    >
                                      Reopen
                                    </button>
                                  )}

                                  {isWorking && (
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Completed')}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                                    >
                                      Done ✓
                                    </button>
                                  )}

                                  {isOpen && (
                                    <>
                                      <button
                                        onClick={() => onTaskStatusChange(project.id, task.id, 'Working')}
                                        className="px-2 py-1 text-[11px] font-bold rounded-lg border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shadow-2xs"
                                      >
                                        Work ⚡
                                      </button>
                                      <button
                                        onClick={() => onTaskStatusChange(project.id, task.id, 'Completed')}
                                        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                                      >
                                        Done ✓
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    ) : (

                      /* ============================================================ */
                      /* 📑 TASK LIST ROW VIEW                                        */
                      /* ============================================================ */
                      <div className="space-y-2.5">
                        {cat.tasks.map(task => {
                          const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
                          const isCompleted = task.status === 'Completed';
                          const isWorking = task.status === 'Working' || task.status === 'In Progress';
                          const isOpen = !isCompleted && !isWorking;

                          const rowBg = isCompleted
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : isWorking
                            ? 'bg-amber-50/45 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50/45 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800';

                          const titleColor = isCompleted
                            ? 'text-emerald-900 dark:text-emerald-200'
                            : isWorking
                            ? 'text-amber-950 dark:text-amber-200'
                            : 'text-rose-950 dark:text-rose-200';

                          return (
                            <div
                              key={task.id}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${rowBg}`}
                            >
                              <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className={`font-mono text-xs font-extrabold ${
                                    isCompleted ? 'text-emerald-700 dark:text-emerald-400' :
                                    isWorking ? 'text-amber-700 dark:text-amber-400' :
                                    'text-rose-700 dark:text-rose-400'
                                  }`}>
                                    {task.id}
                                  </span>
                                  <span className={`text-xs sm:text-sm font-extrabold truncate ${titleColor}`}>
                                    {isCompleted && <span className="mr-1 text-emerald-600">✅</span>}
                                    {isWorking && <span className="mr-1 text-amber-600">⚡</span>}
                                    {isOpen && <span className="mr-1 text-rose-600">📌</span>}
                                    {task.name || task.subject}
                                  </span>
                                </div>

                                <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                                  <span className="flex items-center gap-1 font-medium">
                                    <span>👤 Assignee:</span>
                                    <strong className="text-slate-800 dark:text-slate-200">{assigneeName}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-medium">
                                    <span>📅 Due Date:</span>
                                    <strong className="font-mono text-slate-800 dark:text-slate-200">{task.dueDate || 'N/A'}</strong>
                                  </span>
                                  <span>•</span>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded border ${priorityStyles[task.priority] || priorityStyles['Medium']}`}>
                                    {task.priority === 'Urgent' && '🔥 Urgent'}
                                    {task.priority === 'High' && '▲ High'}
                                    {task.priority === 'Medium' && '● Medium'}
                                    {task.priority === 'Low' && '▽ Low'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {isCompleted && (
                                  <>
                                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Completed
                                    </span>
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Working')}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                                    >
                                      Reopen
                                    </button>
                                  </>
                                )}

                                {isWorking && (
                                  <>
                                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                                      Working
                                    </span>
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Completed')}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                                    >
                                      Done ✓
                                    </button>
                                  </>
                                )}

                                {isOpen && (
                                  <>
                                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
                                      Open
                                    </span>
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Working')}
                                      className="px-2 py-1 text-[11px] font-bold rounded-lg border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shadow-2xs"
                                    >
                                      Work ⚡
                                    </button>
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, task.id, 'Completed')}
                                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                                    >
                                      Done ✓
                                    </button>
                                  </>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
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
