import React from 'react';
import { CATEGORIES, CATEGORY_CONFIG } from '../../data/initialData.js';

export default function CategoryFilterBar({ kpis, categoryFilter, setCategoryFilter }) {
  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            📊 Task Progress by Category
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            (Click to filter)
          </span>
        </div>
        {categoryFilter !== 'All' && (
          <button
            onClick={() => setCategoryFilter('All')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.keys(CATEGORIES).map(key => {
          const cat = CATEGORIES[key];
          const config = CATEGORY_CONFIG[cat] || {
            icon: '📌',
            bgClass: 'bg-slate-50 text-slate-700 border-slate-200',
            barColor: 'bg-indigo-600'
          };
          const stat = kpis.categoryStats?.[cat] || { total: 0, completed: 0, percentage: 0 };
          const isSelected = categoryFilter === cat;

          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(isSelected ? 'All' : cat)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-indigo-500 shadow-sm bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold flex items-center space-x-1.5 text-slate-800 dark:text-slate-200">
                  <span>{config.icon}</span>
                  <span className="truncate">{cat}</span>
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {stat.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className={`${config.barColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>{stat.completed} / {stat.total} Done</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${config.bgClass}`}>
                  {stat.total - stat.completed} pending
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
