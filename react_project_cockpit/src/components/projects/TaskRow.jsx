import React from 'react';
import { CATEGORY_CONFIG } from '../../data/initialData.js';

export default function TaskRow({ task, projectId, onStatusChange, onPriorityChange }) {
  const catConfig = CATEGORY_CONFIG[task.category] || {
    icon: '📌',
    bgClass: 'bg-slate-100 text-slate-700 border-slate-200',
    barColor: 'bg-slate-500'
  };

  const isCompleted = task.status === 'Completed';
  const isWorking = task.status === 'Working' || task.status === 'In Progress';
  const isOpen = task.status === 'Open';

  const priorityClasses = {
    'Urgent': 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
    'High': 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    'Medium': 'bg-slate-100 text-slate-700 border-slate-200',
    'Low': 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div className={`p-3 rounded-xl border transition-all ${
      isCompleted
        ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-90'
        : isWorking
        ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900/40 shadow-xs'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-750'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        
        {/* Left: Task Subject & Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Category Tag */}
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${catConfig.bgClass}`}>
              <span>{catConfig.icon}</span>
              <span>{task.category || 'Development'}</span>
            </span>

            {/* Interactive Priority Selector */}
            {onPriorityChange ? (
              <select
                value={task.priority || 'Medium'}
                onChange={(e) => onPriorityChange(projectId, task.id, e.target.value)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                  priorityClasses[task.priority] || priorityClasses['Medium']
                }`}
                title="Click to change Priority"
              >
                <option value="Urgent">🔥 Urgent</option>
                <option value="High">▲ High</option>
                <option value="Medium">● Medium</option>
                <option value="Low">▽ Low</option>
              </select>
            ) : (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                priorityClasses[task.priority] || priorityClasses['Medium']
              }`}>
                {task.priority || 'Medium'}
              </span>
            )}

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {task.id}
            </span>
          </div>

          <h4 className={`text-sm font-semibold mt-1 text-slate-800 dark:text-slate-200 truncate ${
            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}>
            {task.subject}
          </h4>

          {/* Schedule & Assignee */}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {(task.exp_end_date || task.expectedEndDate) && (
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>Due: {task.exp_end_date || task.expectedEndDate}</span>
              </span>
            )}
            {task.creation && (
              <span className="flex items-center space-x-1">
                <span>🕒</span>
                <span>Created: {task.creation}</span>
              </span>
            )}
            <span className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300">
              <span>👤</span>
              <span>{task.assignee || 'Unassigned'}</span>
            </span>
          </div>
        </div>

        {/* Right: Inline Quick Status Switcher & Progress */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {task.progress || 0}%
            </span>
          </div>

          {/* Quick Status Buttons */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs">
            <button
              onClick={() => onStatusChange(projectId, task.id, 'Open')}
              className={`px-2 py-1 rounded font-medium transition ${
                isOpen
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => onStatusChange(projectId, task.id, 'Working')}
              className={`px-2 py-1 rounded font-medium transition ${
                isWorking
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Working
            </button>
            <button
              onClick={() => onStatusChange(projectId, task.id, 'Completed')}
              className={`px-2 py-1 rounded font-medium transition ${
                isCompleted
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              ✓ Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
