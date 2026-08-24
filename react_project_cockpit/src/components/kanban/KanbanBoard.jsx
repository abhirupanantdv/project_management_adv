import React, { useState, useMemo } from 'react';
import { CATEGORY_CONFIG } from '../../data/initialData.js';

export default function KanbanBoard({ projects, onTaskStatusChange, onTaskPriorityChange, onAddTaskClick }) {
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');

  const columns = [
    {
      id: 'Open',
      title: 'Backlog / Open',
      icon: '📋',
      topBar: 'bg-slate-400',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      desc: 'Tasks ready to be started'
    },
    {
      id: 'Working',
      title: 'In Progress / Working',
      icon: '⚡',
      topBar: 'bg-blue-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Active development & QA tasks'
    },
    {
      id: 'Completed',
      title: 'Completed / Done',
      icon: '✅',
      topBar: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Tested & verified deliverables'
    }
  ];

  // Filter tasks by project if a specific project is selected
  const allTasks = useMemo(() => {
    let projs = projects;
    if (selectedProjectFilter !== 'ALL') {
      projs = projects.filter(p => p.id === selectedProjectFilter);
    }

    return projs.flatMap(p => {
      return (p.tasks || []).map(t => ({
        ...t,
        projectId: p.id,
        projectName: p.name,
        customer: p.customer
      }));
    });
  }, [projects, selectedProjectFilter]);

  const priorityStyles = {
    'Urgent': 'text-rose-600 font-bold',
    'High': 'text-amber-600 font-bold',
    'Medium': 'text-slate-600',
    'Low': 'text-slate-400'
  };

  return (
    <div className="space-y-4">
      
      {/* Kanban Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
            🗂️
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Agile Kanban Workflow Board
            </h2>
            <p className="text-xs text-slate-500">
              Move tasks seamlessly across <strong>Open</strong>, <strong>Working</strong>, and <strong>Completed</strong>
            </p>
          </div>
        </div>

        {/* Project Selector for Kanban */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-500">Filter Project:</label>
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
          >
            <option value="ALL">All 10 Enterprise Projects ({projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)} Tasks)</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                [{p.id}] {p.name} ({p.tasks?.length || 0} tasks)
              </option>
            ))}
          </select>

          {onAddTaskClick && (
            <button
              onClick={() => onAddTaskClick(selectedProjectFilter !== 'ALL' ? selectedProjectFilter : projects[0]?.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map(col => {
          const colTasks = allTasks.filter(t => {
            if (col.id === 'Working') return t.status === 'Working' || t.status === 'In Progress';
            return t.status === col.id;
          });

          return (
            <div
              key={col.id}
              className="bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs"
            >
              {/* Column Top Color Line */}
              <div className={`h-1.5 w-full ${col.topBar}`}></div>

              {/* Column Header */}
              <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span>{col.icon}</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {col.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{col.desc}</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${col.badgeClass}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards in Column */}
              <div className="p-3.5 space-y-3 overflow-y-auto max-h-[680px] custom-scrollbar flex-1">
                {colTasks.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 font-medium">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map(task => {
                    const catConf = CATEGORY_CONFIG[task.category] || {
                      icon: '📌',
                      bgClass: 'bg-slate-100 text-slate-700 border-slate-200'
                    };

                    return (
                      <div
                        key={`${task.projectId}-${task.id}`}
                        className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-2.5"
                      >
                        {/* Top Line: Project ID & Category Tag */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded truncate max-w-[130px]" title={task.projectName}>
                            {task.projectId}
                          </span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${catConf.bgClass}`}>
                            <span>{catConf.icon}</span>
                            <span>{task.category}</span>
                          </span>
                        </div>

                        {/* Task Subject */}
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {task.subject}
                        </h4>

                        {/* Metadata Line */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                          <span>👤 <strong>{task.assignee || 'Unassigned'}</strong></span>
                          <span>•</span>
                          <span>📅 Due: <strong>{task.exp_end_date || task.expectedEndDate || '—'}</strong></span>
                          <span>•</span>
                          
                          {/* Interactive Priority Selector on Kanban Card */}
                          <select
                            value={task.priority || 'Medium'}
                            onChange={(e) => onTaskPriorityChange && onTaskPriorityChange(task.projectId, task.id, e.target.value)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
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

                        {/* Action Buttons to Move Status */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">{task.id}</span>

                          <div className="flex items-center space-x-1.5">
                            {col.id !== 'Open' && (
                              <button
                                onClick={() => onTaskStatusChange(task.projectId, task.id, 'Open')}
                                title="Move back to Open"
                                className="px-2 py-0.5 rounded font-semibold text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                              >
                                ← Open
                              </button>
                            )}
                            {col.id !== 'Working' && (
                              <button
                                onClick={() => onTaskStatusChange(task.projectId, task.id, 'Working')}
                                title="Move to Working"
                                className="px-2 py-0.5 rounded font-semibold text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                              >
                                ⚡ Work
                              </button>
                            )}
                            {col.id !== 'Completed' && (
                              <button
                                onClick={() => onTaskStatusChange(task.projectId, task.id, 'Completed')}
                                title="Mark Done"
                                className="px-2 py-0.5 rounded font-bold text-[10px] text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
                              >
                                ✓ Done
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
