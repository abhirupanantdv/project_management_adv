import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../data/initialData.js';

export default function ProjectDetailsDrawer({
  project,
  isOpen,
  onClose,
  activeTab = 'overview',
  setActiveTab,
  onTaskStatusChange,
  onTaskPriorityChange,
  onAddTaskClick,
  apiConfig
}) {
  const [taskSearch, setTaskSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (!isOpen || !project) return null;

  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const workingTasks = tasks.filter(t => t.status === 'Working' || t.status === 'In Progress').length;
  const pendingTasks = totalTasks - completedTasks;
  const percentCompleted = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (project.percentCompleted || 0);

  const filteredTasks = tasks.filter(t => {
    const matchSearch = !taskSearch || 
      t.subject.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.assignee && t.assignee.toLowerCase().includes(taskSearch.toLowerCase()));
    
    const matchCat = categoryFilter === 'All' || (t.category || 'Development') === categoryFilter;
    return matchSearch && matchCat;
  });

  const deskUrl = `${(apiConfig?.baseUrl || 'http://192.168.101.125').replace(/\/$/, '')}/app/project/${encodeURIComponent(project.id)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-4xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {project.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {project.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {project.priority} Priority
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    🏢 Customer: <strong className="text-slate-800 dark:text-slate-200">{project.customer || project.company || 'Enterprise'}</strong>
                  </span>
                </div>

                <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {project.name}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={deskUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 transition flex items-center space-x-1"
                >
                  <span>ERPNext Desk</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-base transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Overall Rollup Bar */}
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Overall Progress: <strong className="text-slate-900 dark:text-white">{percentCompleted}%</strong> ({completedTasks} completed of {totalTasks} total tasks)</span>
              <span>{pendingTasks} Pending Tasks</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentCompleted === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${percentCompleted}%` }}
              ></div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-3 mt-5 border-b border-slate-200 dark:border-slate-800 -mb-6">
              {[
                { id: 'overview', label: '📊 Project Overview' },
                { id: 'tasks', label: `📋 Task List (${totalTasks})` },
                { id: 'categories', label: '📌 Category-wise Progress' },
                { id: 'team', label: `👥 Team Members (${project.assignedUsers?.length || 0})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block truncate">{project.customer || 'Enterprise'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Type</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">{project.projectType || 'Internal'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">{project.expectedStartDate || project.creation || '—'}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected End Date</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">{project.expectedEndDate || '—'}</span>
                  </div>
                </div>

                {/* Tasks Breakdown Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">Completed Tasks</span>
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">{completedTasks}</span>
                    </div>
                    <span className="text-3xl">✅</span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-800 dark:text-blue-300 block uppercase tracking-wider">Working / In Progress</span>
                      <span className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 block">{workingTasks}</span>
                    </div>
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">Total Tasks Created</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalTasks}</span>
                    </div>
                    <span className="text-3xl">📋</span>
                  </div>
                </div>

                {/* Category Progress Summary Preview */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Work Category Progress
                    </h4>
                    <button onClick={() => setActiveTab('categories')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      View All Category Bars ➔
                    </button>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(CATEGORIES).map(k => {
                      const cat = CATEGORIES[k];
                      const conf = CATEGORY_CONFIG[cat];
                      const catTasks = tasks.filter(t => (t.category || 'Development') === cat);
                      const catTotal = catTasks.length;
                      const catComp = catTasks.filter(t => t.status === 'Completed').length;
                      const catPercent = catTotal > 0 ? Math.round((catComp / catTotal) * 100) : 0;

                      return (
                        <div key={cat} className="flex items-center space-x-3 text-xs">
                          <span className="w-32 font-semibold flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 shrink-0">
                            <span>{conf.icon}</span>
                            <span>{cat}</span>
                          </span>
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`${conf.barColor} h-full rounded-full transition-all`} style={{ width: `${catPercent}%` }}></div>
                          </div>
                          <span className="w-20 text-right font-bold text-slate-700 dark:text-slate-300">
                            {catComp}/{catTotal} ({catPercent}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* 2. TASK LIST TAB (Feature 5: Full Task List Table) */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search task subject, ID, assignee..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs font-medium"
                    >
                      <option value="All">All Categories</option>
                      {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => onAddTaskClick(project.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shrink-0"
                  >
                    + Add Task
                  </button>
                </div>

                {/* Complete Task List Table */}
                <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-3">Task ID</th>
                          <th className="py-3 px-3 min-w-[200px]">Subject</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Assignee</th>
                          <th className="py-3 px-3">Priority</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 whitespace-nowrap">Created Date</th>
                          <th className="py-3 px-3 whitespace-nowrap">Due Date</th>
                          <th className="py-3 px-3 text-center">Progress %</th>
                          <th className="py-3 px-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-slate-400">
                              No tasks found. Click "+ Add Task" to create one.
                            </td>
                          </tr>
                        ) : (
                          filteredTasks.map(t => {
                            const conf = CATEGORY_CONFIG[t.category] || { icon: '📌', bgClass: 'bg-slate-100 text-slate-700' };
                            const isDone = t.status === 'Completed';

                            return (
                              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                
                                {/* Task ID */}
                                <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                                  {t.id}
                                </td>

                                {/* Subject */}
                                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                                  <span className={isDone ? 'line-through text-slate-400' : ''}>
                                    {t.subject}
                                  </span>
                                </td>

                                {/* Category */}
                                <td className="py-3 px-3">
                                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${conf.bgClass}`}>
                                    <span>{conf.icon}</span>
                                    <span>{t.category}</span>
                                  </span>
                                </td>

                                {/* Assignee */}
                                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                                  👤 {t.assignee || 'Unassigned'}
                                </td>

                                {/* Priority */}
                                <td className="py-3 px-3">
                                  <select
                                    value={t.priority || 'Medium'}
                                    onChange={(e) => onTaskPriorityChange && onTaskPriorityChange(project.id, t.id, e.target.value)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                                      t.priority === 'Urgent'
                                        ? 'text-rose-700 bg-rose-50 border-rose-200'
                                        : t.priority === 'High'
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
                                </td>

                                {/* Status */}
                                <td className="py-3 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                    isDone ? 'bg-emerald-100 text-emerald-800' : (t.status === 'Working' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700')
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>

                                {/* Created Date */}
                                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                                  {t.creation || '—'}
                                </td>

                                {/* Due Date */}
                                <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                                  {t.exp_end_date || t.expectedEndDate || '—'}
                                </td>

                                {/* Progress % */}
                                <td className="py-3 px-3 text-center font-bold">
                                  {t.progress || (isDone ? 100 : 0)}%
                                </td>

                                {/* Quick Action */}
                                <td className="py-3 px-3 text-right">
                                  <div className="inline-flex rounded p-0.5 bg-slate-100 dark:bg-slate-900 border text-[10px]">
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, t.id, 'Working')}
                                      className="px-1.5 py-0.5 rounded hover:bg-blue-600 hover:text-white transition"
                                      title="Set Working"
                                    >
                                      Work
                                    </button>
                                    <button
                                      onClick={() => onTaskStatusChange(project.id, t.id, 'Completed')}
                                      className="px-1.5 py-0.5 rounded hover:bg-emerald-600 hover:text-white transition font-bold"
                                      title="Mark Completed"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </td>

                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CATEGORY-WISE PROGRESS TAB (Feature 4) */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time category progress breakdown for {project.name}. Overall progress is automatically calculated from task completions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(CATEGORIES).map(k => {
                    const cat = CATEGORIES[k];
                    const conf = CATEGORY_CONFIG[cat];
                    const catTasks = tasks.filter(t => (t.category || 'Development') === cat);
                    const catTotal = catTasks.length;
                    const catComp = catTasks.filter(t => t.status === 'Completed').length;
                    const catPercent = catTotal > 0 ? Math.round((catComp / catTotal) * 100) : 0;

                    return (
                      <div key={cat} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
                            <span>{conf.icon}</span>
                            <span>{cat} Progress</span>
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {catPercent}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                          <div
                            className={`${conf.barColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${catPercent}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{catComp} of {catTotal} tasks completed</span>
                          <span className="font-semibold">{catTotal - catComp} remaining</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. TEAM TAB */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(project.assignedUsers || []).map((u, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center space-x-3.5">
                      <div className={`w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center bg-gradient-to-tr ${u.color || 'from-indigo-500 to-purple-600'}`}>
                        {u.avatar || u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</h4>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{u.role || 'Team Member'}</p>
                        <p className="text-[10px] text-slate-400">{u.email || 'team@anantdv.com'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              Close View
            </button>
            <button onClick={() => onAddTaskClick(project.id)} className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition">
              + Add Task to {project.id}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
