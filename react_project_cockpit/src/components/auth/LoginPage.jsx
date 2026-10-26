import React, { useState } from 'react';
import AnantdvLogo from '../common/AnantdvLogo.jsx';

// Pre-configured Known Users & Project Managers
export const KNOWN_USERS = [
  {
    id: 'tanuja',
    name: 'Tanuja',
    fullName: 'Tanuja',
    role: 'Project Manager',
    email: 'tanuja@anantdv.com',
    avatar: 'T',
    color: 'from-pink-500 to-rose-600',
    assignedProjectsCount: 8
  },
  {
    id: 'niranjan',
    name: 'Niranjan Singh',
    fullName: 'Niranjan Singh',
    role: 'Senior Project Manager',
    email: 'niranjan@anantdv.com',
    avatar: 'NS',
    color: 'from-blue-600 to-indigo-600',
    assignedProjectsCount: 14
  },
  {
    id: 'sushmita',
    name: 'Sushmita Bhowmick',
    fullName: 'Sushmita Bhowmick',
    role: 'Project Lead',
    email: 'sushmita@anantdv.com',
    avatar: 'SB',
    color: 'from-purple-500 to-indigo-600',
    assignedProjectsCount: 9
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    fullName: 'Alex Chen',
    role: 'Technical Lead',
    email: 'alex@anantdv.com',
    avatar: 'AC',
    color: 'from-amber-500 to-orange-600',
    assignedProjectsCount: 6
  },
  {
    id: 'administrator',
    name: 'Administrator',
    fullName: 'System Administrator',
    role: 'System Manager',
    email: 'admin@anantdv.com',
    avatar: 'A',
    color: 'from-emerald-500 to-teal-600',
    assignedProjectsCount: 40
  }
];

export default function LoginPage({ onLogin, apiConfig = {}, darkMode = false, setDarkMode = () => {} }) {
  const [username, setUsername] = useState('tanuja');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState(apiConfig?.baseUrl || 'http://192.168.101.175');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Select a preset user from the list
  const handleSelectUser = (user) => {
    setUsername(user.id);
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUser = username.trim();

    if (!cleanUser) {
      setError('Please enter your User ID or Email.');
      return;
    }

    if (!password) {
      setError('Please enter your password. Only authentic 192.168.101.175 passwords are accepted.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const cleanServer = (serverUrl || '').trim().replace(/\/+$/, '');

    // Secure ERPNext session authentication endpoints (Vite proxy, same-origin, or direct)
    const loginEndpoints = [
      '/api/method/login',
      '/api/erpnext/method/login',
      `${cleanServer}/api/method/login`
    ];

    let lastErrorMessage = '';
    let authenticated = false;

    for (const endpoint of loginEndpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            usr: cleanUser,
            pwd: password,
            device: 'desktop'
          })
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && (data.message === 'Logged In' || data.home_page)) {
          const matchedProfile = KNOWN_USERS.find(
            u => u.id.toLowerCase() === cleanUser.toLowerCase() || u.name.toLowerCase() === cleanUser.toLowerCase()
          );
          const authUser = {
            username: cleanUser,
            fullName: data.full_name || (matchedProfile ? matchedProfile.fullName : (cleanUser.toLowerCase() === 'administrator' ? 'System Administrator' : cleanUser)),
            email: cleanUser.includes('@') ? cleanUser : (matchedProfile ? matchedProfile.email : `${cleanUser}@anantdv.com`),
            serverUrl: cleanServer,
            role: cleanUser.toLowerCase() === 'administrator' ? 'System Manager' : (matchedProfile ? matchedProfile.role : 'Project Member'),
            avatar: (cleanUser.charAt(0) || 'U').toUpperCase(),
            loggedInAt: new Date().toISOString(),
            isLiveSession: true
          };
          onLogin(authUser, rememberMe);
          authenticated = true;
          return;
        } else if (res.status === 401 || data.message === 'Invalid login credentials' || (data.exc_type && data.exc_type.includes('AuthenticationError'))) {
          lastErrorMessage = 'Invalid login credentials! Please enter the correct password for 192.168.101.175 site administrator or user.';
          break;
        } else if (data.message && typeof data.message === 'string') {
          lastErrorMessage = data.message;
        }
      } catch (callErr) {
        // Continue to next endpoint
      }
    }

    setIsLoading(false);
    if (!authenticated) {
      setError(lastErrorMessage || 'Invalid password! Access denied. Only valid 192.168.101.175 administrator or user passwords can open this page.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>

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

      <div className="w-full max-w-lg relative z-10 my-4">
        
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-3 transform hover:scale-105 transition-transform">
            <AnantdvLogo darkMode={true} size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Project Cockpit Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Enter your User ID and password to access your Projects &amp; Tasks
          </p>
        </div>

        {/* Main Glassmorphic Login Card */}
        <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/60 relative overflow-hidden">
          
          {/* Top Rainbow Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 via-purple-500 to-amber-400"></div>

          {/* Quick Select User Badge Strip */}
          <div className="mb-5 pb-4 border-b border-slate-800">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select or Click Particular User ID:
            </label>
            <div className="flex flex-wrap gap-2">
              {KNOWN_USERS.map((u) => {
                const isSelected = username.toLowerCase() === u.id.toLowerCase();
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/25 scale-102 ring-2 ring-indigo-400/30'
                        : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[10px] font-black flex items-center justify-center">
                      {u.avatar}
                    </span>
                    <span>{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-start gap-2.5">
              <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username / User ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Particular User ID / Email:
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
                  placeholder="e.g. tanuja, sushmita, niranjan, or administrator"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password:
                </label>
                <button
                  type="button"
                  onClick={() => setShowServerConfig(!showServerConfig)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  {showServerConfig ? 'Hide Server' : '?? ERPNext Host'}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. 123456 or ERPNext password)"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? '???' : '???????'}
                </button>
              </div>
            </div>

            {/* Collapsible ERPNext Server Target Config */}
            {showServerConfig && (
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-2 text-xs animate-fadeIn">
                <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Target ERPNext Instance URL
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="http://192.168.101.175"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <span>Remember this user session</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">ERPNext v15</span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Authenticating User...</span>
                </>
              ) : (
                <>
                  <span>Sign In &amp; Open Projects &amp; Tasks UI</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-slate-500 mt-5 font-medium">
          Protected with end-to-end ERPNext / Frappe User Authentication
        </p>

      </div>
    </div>
  );
}
