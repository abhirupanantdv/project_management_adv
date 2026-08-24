import React from 'react';

export default function Header({
  darkMode,
  setDarkMode,
  apiConfig,
  setIsApiConfigModalOpen,
  setIsNewProjectModalOpen,
  setIsNewTaskModalOpen,
  isSyncing,
  onManualSync
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold font-display text-slate-900 dark:text-white leading-none">
                  ERPNext Project Cockpit
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  v2.4 PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Executive Tracking & Task Rollup Dashboard
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live API Sync Status Badge */}
            <button
              onClick={() => setIsApiConfigModalOpen(true)}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                apiConfig.isLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Click to configure ERPNext REST API connection"
            >
              <span className={`w-2 h-2 rounded-full ${apiConfig.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="hidden sm:inline">{apiConfig.isLive ? 'ERPNext Live' : 'Demo / Mock Mode'}</span>
              <span className="text-slate-400 dark:text-slate-500">⚙️</span>
            </button>

            {/* Refresh / Sync Button */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              title="Refresh / Recompute Data"
            >
              <span className={`inline-block ${isSyncing ? 'animate-spin' : ''}`}>🔄</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Action Buttons */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-sm"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition shadow-sm shadow-indigo-500/20"
            >
              <span>+</span>
              <span>New Project</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
