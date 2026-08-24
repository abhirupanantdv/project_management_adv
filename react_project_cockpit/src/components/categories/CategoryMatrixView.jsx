import React from 'react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../data/initialData.js';

export default function CategoryMatrixView({ projects, onOpenDetails }) {
  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📌</span>
            <span>Category Progress Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-project comparison across Development, UI, Migration, Testing, and Documentation
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 min-w-[200px]">Project</th>
              {Object.keys(CATEGORIES).map(k => {
                const cat = CATEGORIES[k];
                const conf = CATEGORY_CONFIG[cat];
                return (
                  <th key={cat} className="py-3.5 px-3 min-w-[140px] text-center">
                    <span className="inline-flex items-center space-x-1">
                      <span>{conf.icon}</span>
                      <span>{cat}</span>
                    </span>
                  </th>
                );
              })}
              <th className="py-3.5 px-4 text-center">Total Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {projects.map(p => {
              const tasks = p.tasks || [];
              const totalTasks = tasks.length;
              const completedTasks = tasks.filter(t => t.status === 'Completed').length;
              const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                  {/* Project Name */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onOpenDetails(p)}
                      className="text-left group"
                    >
                      <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        {p.id}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.manager || 'No Manager'} • {totalTasks} tasks
                      </div>
                    </button>
                  </td>

                  {/* 5 Categories Columns */}
                  {Object.keys(CATEGORIES).map(k => {
                    const cat = CATEGORIES[k];
                    const conf = CATEGORY_CONFIG[cat];
                    const catTasks = tasks.filter(t => (t.category || 'Development') === cat);
                    const catTotal = catTasks.length;
                    const catComp = catTasks.filter(t => t.status === 'Completed').length;
                    const catPercent = catTotal > 0 ? Math.round((catComp / catTotal) * 100) : null;

                    return (
                      <td key={cat} className="py-3.5 px-3 text-center">
                        {catTotal > 0 ? (
                          <div className="inline-block w-full max-w-[120px]">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              <span>{catComp}/{catTotal}</span>
                              <span>{catPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`${conf.barColor} h-full rounded-full transition-all duration-300`}
                                style={{ width: `${catPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Overall % */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {overallPercent}%
                    </span>
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
