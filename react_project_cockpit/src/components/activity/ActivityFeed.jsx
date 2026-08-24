import React from 'react';
import { CATEGORY_CONFIG } from '../../data/initialData.js';

export default function ActivityFeed({ activities, onClearActivities }) {
  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>🕒</span>
            <span>Recent Task Activities & Audit Trail</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time feed of task completions, status transitions, and team updates
          </p>
        </div>
        {activities.length > 0 && onClearActivities && (
          <button
            onClick={onClearActivities}
            className="text-xs text-slate-400 hover:text-rose-500 font-medium transition"
          >
            Clear History
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No recent activity logged yet. Change any task status to see live activity events!
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {activities.map((act) => {
            const catConf = CATEGORY_CONFIG[act.category] || {
              icon: '📌',
              bgClass: 'bg-slate-100 text-slate-700 border-slate-200'
            };

            return (
              <div key={act.id} className="relative flex items-start space-x-3.5 group">
                {/* User / Action Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0 shadow-sm">
                  {act.userAvatar || (act.user ? act.user.slice(0, 2).toUpperCase() : 'ME')}
                </div>

                {/* Event Content */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700 transition">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.user || 'Team Member'}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        {act.projectId}
                      </span>
                      {act.category && (
                        <span className={`inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${catConf.bgClass}`}>
                          <span>{catConf.icon}</span>
                          <span>{act.category}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.timestamp || act.date}
                    </span>
                  </div>

                  {/* Task Subject */}
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold mb-1.5">
                    {act.taskSubject}
                  </p>

                  {/* Status Transition Badge */}
                  {act.type === 'status_change' && (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Changed status from</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 font-semibold">
                        {act.fromStatus}
                      </span>
                      <span>➔</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        act.toStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {act.toStatus}
                      </span>
                    </div>
                  )}

                  {act.type === 'progress_update' && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Updated progress to <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{act.progress}%</strong>
                    </div>
                  )}

                  {act.type === 'task_created' && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      + Created new task in project {act.projectName || act.projectId}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
