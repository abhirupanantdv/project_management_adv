import React from 'react';

export default function Header({
  darkMode,
  setDarkMode,
  apiConfig,
  setIsApiConfigModalOpen,
  setIsNewProjectModalOpen,
  setIsNewTaskModalOpen,
  isSyncing,
  onManualSync,
  user,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
      {/* Top Signature Brand Accent Line matching Anantdv Rainbow Aura */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-500 via-pink-500 to-amber-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 group cursor-pointer shrink-0">
            <div className="h-10 sm:h-11 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center shrink-0">
              <img
                src={darkMode ? "/anantdv_logo_dark.png" : "/anantdv_logo.png"}
                alt="Anantdv"
                className="h-7 w-auto object-contain max-w-[130px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/anantdv_logo.png';
                }}
              />
            </div>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div>
              <h1 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white leading-none">
                Anantdv Project Cockpit
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Executive Tracking &amp; Task Rollup Dashboard
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-wrap justify-end">
            
            {/* Redesigned Executive Live Server Instance Button */}
            <button
              onClick={() => setIsApiConfigModalOpen(true)}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-[0.97] border border-slate-700/80 cursor-pointer"
              title="Connected to ERPNext Server Instance - Click to configure"
            >
              <div className="flex items-center gap-1.5 bg-emerald-950/90 px-1.5 py-0.5 rounded-md border border-emerald-500/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-300 uppercase tracking-wider">LIVE</span>
              </div>
              <span className="truncate max-w-[120px] font-mono text-[11px] font-bold text-slate-100 hidden md:inline">
                {apiConfig?.baseUrl?.replace(/^https?:\/\//, '') || '192.168.101.175'}
              </span>
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] border border-blue-400/40 cursor-pointer"
              title="Refresh / Fetch Live ERPNext Updates"
            >
              <svg className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline font-bold">Refresh</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? '??' : '??'}
            </button>

            {/* Action Buttons */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="hidden lg:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-xs cursor-pointer"
            >
              <span>+</span>
              <span>Task</span>
            </button>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              <span>+</span>
              <span>Project</span>
            </button>

            {/* Prominent User Profile & High-Visibility Logout Button */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {(user.fullName || user.username || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left max-w-[130px]">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 truncate leading-tight">
                      {user.fullName || user.username}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                      {user.role || 'Member'}
                    </div>
                  </div>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Log Out of Project Cockpit"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/25 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
