import React from 'react';

export default function ProjectTableView({ projects, onOpenDetails, onAddTaskClick }) {
  const statusStyles = {
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'Working': 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Pending Review': 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'Open': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };

  const priorityStyles = {
    'Urgent': 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    'High': 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    'Medium': 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    'Low': 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Table Header Bar */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📑</span>
            <span>All Projects Overview</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Single unified table displaying all ERPNext projects, customers, schedules, assignees, and real-time rollups
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 min-w-[180px]">Project Name & ID</th>
              <th className="py-3.5 px-4 min-w-[130px]">Customer</th>
              <th className="py-3.5 px-3">Project Status</th>
              <th className="py-3.5 px-3">Priority</th>
              <th className="py-3.5 px-3">Project Type</th>
              <th className="py-3.5 px-3">Created Date</th>
              <th className="py-3.5 px-3">Expected End Date</th>
              <th className="py-3.5 px-3">Assigned Users</th>
              <th className="py-3.5 px-3">Total Tasks</th>
              <th className="py-3.5 px-4 text-center min-w-[140px]">Overall Progress (%)</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map(p => {
              const tasks = p.tasks || [];
              const total = tasks.length;
              const completed = tasks.filter(t => t.status === 'Completed').length;
              const percent = total > 0 ? Math.round((completed / total) * 100) : (p.percentCompleted || 0);

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition duration-150">
                  
                  {/* 1. Project Name & ID */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onOpenDetails(p)}
                      className="text-left group block"
                    >
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px] block">
                        {p.id}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition text-sm">
                        {p.name}
                      </span>
                    </button>
                  </td>

                  {/* 2. Customer */}
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center space-x-1.5">
                      <span>🏢</span>
                      <span className="truncate max-w-[140px]">{p.customer || p.company || 'Enterprise'}</span>
                    </div>
                  </td>

                  {/* 3. Project Status */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      statusStyles[p.status] || statusStyles['Open']
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                      <span>{p.status}</span>
                    </span>
                  </td>

                  {/* 4. Priority (High/Medium/Low/Urgent) */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      priorityStyles[p.priority] || priorityStyles['Medium']
                    }`}>
                      {p.priority === 'Urgent' && '🔥 '}
                      {p.priority === 'High' && '▲ '}
                      {p.priority === 'Medium' && '● '}
                      {p.priority === 'Low' && '▽ '}
                      {p.priority}
                    </span>
                  </td>

                  {/* 5. Project Type */}
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                    {p.projectType || 'Internal'}
                  </td>

                  {/* 6. Created Date */}
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {p.creation || '—'}
                  </td>

                  {/* 7. Expected End Date */}
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {p.expectedEndDate || '—'}
                  </td>

                  {/* 8. Assigned Users */}
                  <td className="py-3.5 px-3">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {(p.assignedUsers && p.assignedUsers.length > 0) ? (
                        p.assignedUsers.map((u, i) => (
                          <div
                            key={i}
                            title={`${u.name} (${u.role || 'Member'})`}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white bg-gradient-to-tr ${
                              u.color || 'from-indigo-500 to-purple-600'
                            } ring-2 ring-white dark:ring-slate-850`}
                          >
                            {u.avatar || u.name.slice(0, 2).toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </div>
                  </td>

                  {/* 9. Total Tasks */}
                  <td className="py-3.5 px-3">
                    {total === 0 ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <span>⚠️</span>
                        <span>0 Tasks</span>
                      </span>
                    ) : (
                      <>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {completed} / {total} Done
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {total - completed} pending
                        </div>
                      </>
                    )}
                  </td>

                  {/* 10. Overall Progress (%) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs w-9 text-right">
                        {percent}%
                      </span>
                    </div>
                  </td>

                  {/* 11. Action (View Details) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onOpenDetails(p)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 transition"
                      >
                        View Details ↗
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
