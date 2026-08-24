import React, { useState, useEffect } from 'react';
import { configureSmtpBackend, getBackendMailStatus } from '../../services/reminderEmailService.js';

export default function SmtpConfigModal({
  isOpen,
  onClose,
  onConfigured
}) {
  const [host, setHost] = useState('smtp.hostinger.com');
  const [port, setPort] = useState('465');
  const [user, setUser] = useState('tanuja.d@anantdv.com');
  const [pass, setPass] = useState('');
  const [fromName, setFromName] = useState('Anantdv Project Cockpit');
  const [fromEmail, setFromEmail] = useState('');
  const [secure, setSecure] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getBackendMailStatus().then(st => {
        setCurrentStatus(st);
        if (st && st.host) setHost(st.host);
        if (st && st.port) setPort(String(st.port));
        if (st && st.fromEmail) setFromEmail(st.fromEmail);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: 'info', text: 'Connecting to Hostinger SMTP server (smtp.hostinger.com)...' });

    const res = await configureSmtpBackend({
      host,
      port,
      user,
      pass,
      fromName,
      fromEmail: fromEmail || user,
      secure: port === '465' || secure
    });

    setIsSaving(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: '✅ Hostinger SMTP connected & authenticated! Emails can now be sent live to Sushmita, Niranjan, and Tanuja.' });
      if (onConfigured) onConfigured();
      setTimeout(() => {
        onClose();
      }, 2200);
    } else {
      setStatusMsg({ type: 'error', text: `❌ ${res.error || 'Failed to authenticate on Hostinger SMTP. Please check email password.'}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-600/15 via-rose-500/10 to-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/30">
              🟣
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Hostinger Email SMTP Setup
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-purple-600 text-white">
                  mail.hostinger.com
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure outgoing mail for Sushmita, Niranjan, and Tanuja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          {statusMsg && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' :
              statusMsg.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300' :
              'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
            }`}>
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Hostinger Direct Webmail Callout */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-purple-950 dark:text-purple-200 block">🌐 Hostinger Webmail Access:</span>
              <span className="text-[11px] text-purple-800 dark:text-purple-300">Log in or view sent emails at mail.hostinger.com</span>
            </div>
            <a
              href="https://mail.hostinger.com/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-[11px] shadow-xs flex items-center gap-1 shrink-0"
            >
              <span>Open Webmail</span>
              <span>↗</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hostinger SMTP Server</label>
              <input
                required
                value={host}
                onChange={e => setHost(e.target.value)}
                placeholder="smtp.hostinger.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Port (SSL/TLS)</label>
              <select
                value={port}
                onChange={e => {
                  setPort(e.target.value);
                  setSecure(e.target.value === '465');
                }}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold"
              >
                <option value="465">465 (SSL)</option>
                <option value="587">587 (TLS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sender Email Address (Hostinger Account)</label>
            <input
              required
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="e.g. tanuja.d@anantdv.com or your hostinger email"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hostinger Email Password</label>
            <input
              required
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Enter your Hostinger email password"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sender Display Name</label>
              <input
                value={fromName}
                onChange={e => setFromName(e.target.value)}
                placeholder="Anantdv Project Cockpit"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">From Address</label>
              <input
                value={fromEmail || user}
                onChange={e => setFromEmail(e.target.value)}
                placeholder="Defaults to sender email"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isSaving ? '⏳' : '⚡'}</span>
              <span>{isSaving ? 'Authenticating with Hostinger...' : 'Authenticate & Save Hostinger SMTP'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
