import React from 'react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../data/initialData.js';

export default function AnalyticsView({ kpis, projects, onOpenDetails }) {
  const avgCompletion = kpis.overallProgress || 0;

  return (
    <div className="space-y-6">
      
      {/* 6 Visual Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Projects</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block font-display">{kpis.totalProjects}</span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">📁 All DocTypes</span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-sm">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Active Projects</span>
          <span className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 block font-display">{kpis.activeProjects}</span>
          <span className="text-[11px] text-blue-500 font-semibold mt-1 block">⚡ In Progress</span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Completed Projects</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block font-display">{kpis.completedProjects}</span>
          <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">✅ Done 100%</span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tasks</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block font-display">{kpis.totalTasks}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">📋 Linked Tasks</span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Overdue Tasks</span>
          <span className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1 block font-display">{kpis.overdueTasks}</span>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">⚠️ Behind Schedule</span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/50 shadow-sm">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Avg. Completion</span>
          <span className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1 block font-display">{avgCompletion}%</span>
          <span className="text-[11px] text-purple-500 font-semibold mt-1 block">📈 Overall Rollup</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Tasks by Category */}
        <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>📊</span>
                <span>Tasks by Category Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Work breakdown across 5 ERPNext categories
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              {kpis.totalTasks} Tasks Total
            </span>
          </div>

          <div className="space-y-4">
            {Object.keys(CATEGORIES).map(k => {
              const cat = CATEGORIES[k];
              const conf = CATEGORY_CONFIG[cat];
              const stat = kpis.categoryStats?.[cat] || { total: 0, completed: 0, percentage: 0 };
              const categoryShare = kpis.totalTasks > 0 ? Math.round((stat.total / kpis.totalTasks) * 100) : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                      <span>{conf.icon}</span>
                      <span>{cat}</span>
                    </span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {stat.completed} / {stat.total} Completed ({stat.percentage}%) • <strong className="text-slate-900 dark:text-white">{categoryShare}% share</strong>
                    </span>
                  </div>

                  {/* Dual Bar (Total share + completed portion) */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`${conf.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Project Completion Comparison Chart */}
        <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>📈</span>
                <span>Project Completion Comparison Chart</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Relative progress % and customer breakdown
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
              {kpis.completedProjects} Finished
            </span>
          </div>

          <div className="space-y-3.5">
            {projects.map(p => {
              const tasks = p.tasks || [];
              const comp = tasks.filter(t => t.status === 'Completed').length;
              const percent = tasks.length > 0 ? Math.round((comp / tasks.length) * 100) : (p.percentCompleted || 0);

              return (
                <div
                  key={p.id}
                  onClick={() => onOpenDetails && onOpenDetails(p)}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="truncate max-w-[260px]">
                      <span className="font-mono text-indigo-600 font-bold text-[10px] mr-1.5">{p.id}</span>
                      <strong className="text-slate-900 dark:text-white group-hover:text-indigo-600 transition">{p.name}</strong>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>🏢 {p.customer || 'Enterprise'}</span>
                    <span>{comp} / {tasks.length} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
