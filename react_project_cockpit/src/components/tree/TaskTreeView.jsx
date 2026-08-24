import React, { useState } from 'react';
import { CATEGORY_CONFIG } from '../../data/initialData.js';

// Recursive Task Tree Node
function TaskTreeNode({
  task,
  depth = 0,
  onStatusChange,
  onPriorityChange,
  onAddSubtask
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = task.children && task.children.length > 0;

  // Status Styling
  const statusStyles = {
    'Completed': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'In Progress': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'Not Started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };

  // Priority Styling
  const priorityStyles = {
    'Urgent': 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    'High': 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'Medium': 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Low': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  };

  const catConfig = CATEGORY_CONFIG[task.category || 'Development'] || CATEGORY_CONFIG['Development'];
  const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
  const assigneeAvatar = typeof task.assignee === 'object' ? task.assignee?.avatar : (assigneeName.slice(0, 2).toUpperCase() || 'U');

  return (
    <div className="space-y-1 select-none">
      <div 
        className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
          task.status === 'Completed'
            ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs'
        }`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        {/* Left: Expand Toggle + Name + Level Tag */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
          {/* Expand/Collapse Chevron */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
            >
              <span className={`text-[10px] transform transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`}>
                ▶
              </span>
            </button>
          ) : (
            <div className="w-5 flex items-center justify-center text-slate-300 dark:text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            </div>
          )}

          {/* Level Hierarchy Indicator */}
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
            {depth === 0 ? 'Parent Task' : depth === 1 ? 'Child Task' : 'Subtask'}
          </span>

          {/* Task ID */}
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {task.id}
          </span>

          {/* Task Name */}
          <span className={`text-xs sm:text-sm font-semibold truncate ${
            task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
          }`}>
            {task.name || task.subject}
          </span>

          {/* Category Chip */}
          <span className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${catConfig.bgClass} shrink-0`}>
            <span>{catConfig.icon}</span>
            <span>{task.category || 'Development'}</span>
          </span>
        </div>

        {/* Right: Assignee, Status, Priority, Progress %, Due Date */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          
          {/* Assignee with Avatar */}
          <div className="hidden sm:flex items-center gap-1.5" title={`Assignee: ${assigneeName}`}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[9px] flex items-center justify-center shadow-2xs">
              {assigneeAvatar}
            </div>
            <span className="text-slate-600 dark:text-slate-400 max-w-[100px] truncate text-xs font-medium">
              {assigneeName}
            </span>
          </div>

          {/* Priority Badge */}
          <span className={`hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md border ${priorityStyles[task.priority] || priorityStyles['Medium']}`}>
            {task.priority === 'Urgent' && '🔥 '}
            {task.priority === 'High' && '▲ '}
            {task.priority === 'Medium' && '● '}
            {task.priority === 'Low' && '▽ '}
            {task.priority || 'Medium'}
          </span>

          {/* Interactive Status Switcher */}
          <select
            value={task.status || 'Not Started'}
            onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
            className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              statusStyles[task.status] || statusStyles['Not Started']
            }`}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Progress % Bar */}
          <div className="hidden md:flex items-center gap-2 min-w-[90px]">
            <div className="w-14 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  task.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${task.progress || (task.status === 'Completed' ? 100 : 0)}%` }}
              ></div>
            </div>
            <span className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
              {task.progress || (task.status === 'Completed' ? 100 : 0)}%
            </span>
          </div>

          {/* Due Date */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <span>📅</span>
            <span>{task.dueDate || 'N/A'}</span>
          </div>

        </div>
      </div>

      {/* Recursive Children (Child Tasks & Subtasks) */}
      {hasChildren && isExpanded && (
        <div className="space-y-1 relative before:absolute before:left-3 before:top-0 before:bottom-3 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          {task.children.map(child => (
            <TaskTreeNode
              key={child.id}
              task={child}
              depth={depth + 1}
              onStatusChange={onStatusChange}
              onPriorityChange={onPriorityChange}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Task Tree View Component
export default function TaskTreeView({
  tasks = [],
  onStatusChange,
  onPriorityChange,
  onAddTask
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <span className="text-4xl">🌳</span>
        <h4 className="text-sm font-bold">No tasks in tree</h4>
        <p className="text-xs text-slate-400">Add a parent task to start organizing the project hierarchy.</p>
        <button
          onClick={onAddTask}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-xs hover:bg-indigo-700"
        >
          + Add First Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
        <span>Task Tree Hierarchy (Parent → Child → Subtask)</span>
        <span>Status / Progress / Due Date</span>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <TaskTreeNode
            key={task.id}
            task={task}
            depth={0}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
            onAddSubtask={onAddTask}
          />
        ))}
      </div>
    </div>
  );
}
