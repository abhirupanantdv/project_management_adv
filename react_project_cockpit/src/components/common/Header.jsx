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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
      {/* 🌈 Top Signature Brand Accent Line matching Anantdv Rainbow Aura */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-500 via-pink-500 to-amber-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="h-10 sm:h-11 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center shrink-0">
              <img
                src="/anantdv_logo.png"
                alt="Anantdv"
                className="h-7 w-auto object-contain max-w-[130px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'anantdv_logo.png';
                }}
              />
            </div>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div>
              <h1 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white leading-none">
                Anantdv Project Cockpit
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Executive Tracking & Task Rollup Dashboard
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Redesigned Executive Live Server Instance Button */}
            <button
              onClick={() => setIsApiConfigModalOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-[0.97] border border-slate-700/80 cursor-pointer"
              title="Connected to ERPNext Server Instance - Click to configure"
            >
              <div className="flex items-center gap-1.5 bg-emerald-950/90 px-1.5 py-0.5 rounded-md border border-emerald-500/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-300 uppercase tracking-wider">LIVE</span>
              </div>
              <span className="truncate max-w-[120px] font-mono text-[11px] font-bold text-slate-100 hidden sm:inline">192.168.101.175</span>
              <span className="text-xs text-slate-400 group-hover:text-white group-hover:rotate-45 transition-transform duration-300">⚙️</span>
            </button>

            {/* Highlighted Manual Refresh Button */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="group relative flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] border border-blue-400/40 cursor-pointer"
              title="Refresh / Fetch Live ERPNext Updates"
            >
              <span className={`text-xs ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>🔄</span>
              <span className="hidden sm:inline font-bold">Refresh Data</span>
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
