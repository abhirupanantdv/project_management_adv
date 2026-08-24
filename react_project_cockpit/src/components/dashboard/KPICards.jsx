import React from 'react';

export default function KPICards({ kpis }) {
  const cards = [
    {
      title: "Total Projects",
      value: kpis.totalProjects,
      subtitle: `${kpis.activeProjects} Active • ${kpis.completedProjects} Completed`,
      icon: "📁",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
      accentBorder: "border-blue-200 dark:border-blue-900/50"
    },
    {
      title: "Total Tasks Created",
      value: kpis.totalTasks,
      subtitle: `${kpis.completedTasks} Done • ${kpis.workingTasks} In Progress`,
      icon: "📋",
      iconBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
      accentBorder: "border-indigo-200 dark:border-indigo-900/50"
    },
    {
      title: "Overall Completion",
      value: `${kpis.overallProgress}%`,
      subtitle: `${kpis.completedTasks} of ${kpis.totalTasks} total tasks completed`,
      icon: "📈",
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
      accentBorder: "border-emerald-200 dark:border-emerald-900/50",
      isProgress: true,
      percentage: kpis.overallProgress
    },
    {
      title: "Overdue / Attention",
      value: kpis.overdueTasks,
      subtitle: kpis.overdueTasks > 0 ? "Requires manager intervention" : "All schedules on track",
      icon: "⚠️",
      iconBg: kpis.overdueTasks > 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      accentBorder: kpis.overdueTasks > 0 ? "border-rose-300 dark:border-rose-900/60" : "border-slate-200 dark:border-slate-800"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white dark:bg-slate-850 rounded-2xl p-5 border ${card.accentBorder} shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${card.iconBg}`}>
              {card.icon}
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {card.value}
            </span>
          </div>

          {card.isProgress ? (
            <div className="mt-3">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${card.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                {card.subtitle}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {card.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
