import React from 'react';

export default function ProjectCard({
  project,
  onOpenProject
}) {
  const percentCompleted = project.percentCompleted || 0;
  const teamCount = project.assignedTeamCount || (project.assignedUsers?.length) || 1;
  const isCompleted = project.status === 'Completed' || percentCompleted === 100;
  const isUrgent = project.priority === 'Urgent' && !isCompleted;

  // Status Styling - Clean Original Enterprise Badges
  const statusBadgeStyles = {
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold',
    'In Progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 font-bold',
    'Not Started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-medium'
  };

  // Priority Styling
  const priorityStyles = {
    'Urgent': 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-extrabold animate-pulse',
    'High': 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'Medium': 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Low': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  };

  return (
    <div
      onClick={() => onOpenProject && onOpenProject(project.id)}
      className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
        isUrgent 
          ? 'border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20 hover:border-rose-500 hover:ring-rose-500/40' 
          : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
      }`}
    >
      {/* Top Header: ID, Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {project.id}
            </span>
            {isUrgent && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-rose-600 text-white animate-pulse">
                🔥 Urgent
              </span>
            )}
          </div>
          
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeStyles[project.status] || statusBadgeStyles['In Progress']}`}>
            <span className={`w-2 h-2 rounded-full ${
              isCompleted ? 'bg-emerald-500' :
              project.status === 'In Progress' ? 'bg-indigo-500' :
              'bg-slate-400'
            }`}></span>
            <span>{project.status}</span>
          </span>
        </div>

        {/* Project Name */}
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {project.name}
        </h3>

        {/* Company & Priority */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${priorityStyles[project.priority] || priorityStyles['Medium']}`}>
            {project.priority === 'Urgent' && '🔥 '}
            {project.priority === 'High' && '▲ '}
            {project.priority === 'Medium' && '● '}
            {project.priority === 'Low' && '▽ '}
            {project.priority}
          </span>
          {project.company && (
            <span className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
              🏢 {project.company}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Progress
          </span>
          <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
            {percentCompleted}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentCompleted === 100
                ? 'bg-emerald-500'
                : isUrgent
                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}
            style={{ width: `${percentCompleted}%` }}
          ></div>
        </div>
      </div>

      {/* Footer: Due Date & Assigned Team Count */}
      <div className="flex items-center justify-between text-xs pt-1 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span>📅</span>
          <span>Due: <strong className="text-slate-700 dark:text-slate-300">{project.dueDate || project.expectedEndDate || 'N/A'}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {project.assignedUsers && project.assignedUsers.length > 0 && (
            <div className="flex -space-x-1.5 overflow-hidden">
              {project.assignedUsers.slice(0, 3).map((u, i) => (
                <div
                  key={i}
                  title={u.name}
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[8px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
                >
                  {u.avatar || u.name?.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          )}
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            👥 {teamCount}
          </span>
        </div>
      </div>

      {/* Open Details Action */}
      <div className="pt-1 text-right">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center justify-end gap-1">
          <span>Open Project Details</span>
          <span>→</span>
        </span>
      </div>
    </div>
  );
}
