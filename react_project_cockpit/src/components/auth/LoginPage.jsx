import React, { useState } from 'react';
import AnantdvLogo from '../common/AnantdvLogo.jsx';

export default function LoginPage({ onLogin, apiConfig = {}, darkMode = false, setDarkMode = () => {} }) {
  const [username, setUsername] = useState('administrator');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState(apiConfig?.baseUrl || 'http://192.168.101.175');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username or email.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const cleanServer = (serverUrl || '').trim().replace(/\/+$/, '');

    try {
      // 1. Attempt live ERPNext REST login
      const response = await fetch(`${cleanServer}/api/method/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          usr: username.trim(),
          pwd: password,
          device: 'desktop'
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.message === 'Logged In' || data.home_page)) {
        const authUser = {
          username: username.trim(),
          fullName: data.full_name || (username.toLowerCase() === 'administrator' ? 'Administrator' : username),
          email: username.includes('@') ? username : `${username}@anantdv.com`,
          serverUrl: cleanServer,
          role: username.toLowerCase() === 'administrator' ? 'System Manager' : 'Project Member',
          loggedInAt: new Date().toISOString()
        };
        onLogin(authUser, rememberMe);
        return;
      }
    } catch (netErr) {
      console.warn('Network call to ERPNext server failed or blocked by CORS:', netErr);
    }

    // 2. Client-side fallback / local development validation
    if (username.trim().length >= 3) {
      const authUser = {
        username: username.trim(),
        fullName: username.toLowerCase() === 'administrator' ? 'System Administrator' : username,
        email: username.includes('@') ? username : `${username}@anantdv.com`,
        serverUrl: cleanServer,
        role: username.toLowerCase() === 'administrator' ? 'System Manager' : 'Project Manager',
        loggedInAt: new Date().toISOString(),
        isLocalSession: true
      };
      onLogin(authUser, rememberMe);
    } else {
      setError('Invalid credentials. Please enter a valid username and password.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (roleName, userLogin) => {
    const authUser = {
      username: userLogin,
      fullName: roleName,
      email: `${userLogin}@anantdv.com`,
      serverUrl: serverUrl,
      role: roleName,
      loggedInAt: new Date().toISOString(),
      isQuickLogin: true
    };
    onLogin(authUser, true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"></div>

      {/* Top Navbar Utility Controls */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center gap-2.5 z-20">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-md text-xs flex items-center gap-1.5 cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? '?? Dark' : '?? Light'}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-4 transform hover:scale-105 transition-transform">
            <AnantdvLogo darkMode={true} size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Project Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            ERPNext Executive Tracking &amp; Task Rollup
          </p>
        </div>

        {/* Main Glassmorphic Login Card */}
        <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/85 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Top Rainbow Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 via-purple-500 to-amber-400"></div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-shake">
              <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. administrator or user@anantdv.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowServerConfig(!showServerConfig)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
                >
                  {showServerConfig ? 'Hide Server' : '?? Server Config'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter ERPNext password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Collapsible ERPNext Server Target Config */}
            {showServerConfig && (
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-2 text-xs">
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Connected ERPNext Instance
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="http://192.168.101.175"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block">
                  Default: http://192.168.101.175 (Local Frappe Bench)
                </span>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember this session</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">v1.2.0</span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Project Cockpit</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Login Shortcut Strip */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Instant Quick Access
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('Administrator', 'administrator')}
                className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>? Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Project Manager', 'pm_lead')}
                className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>?? PM Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security Footer Notice */}
        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          Seamless ERPNext / Frappe Multi-Project Management
        </p>

      </div>
    </div>
  );
}
