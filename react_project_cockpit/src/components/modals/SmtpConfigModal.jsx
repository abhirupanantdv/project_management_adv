import React, { useState, useEffect } from 'react';
import { configureSmtpBackend, getBackendMailStatus } from '../../services/reminderEmailService.js';

export default function SmtpConfigModal({
  isOpen,
  onClose,
  onConfigured
}) {
  const [host, setHost] = useState('smtp.office365.com');
  const [port, setPort] = useState('587');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [fromName, setFromName] = useState('Anantdv Project Cockpit');
  const [fromEmail, setFromEmail] = useState('');
  const [secure, setSecure] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getBackendMailStatus().then(st => setCurrentStatus(st));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg({ type: 'info', text: 'Testing connection to SMTP server...' });

    const res = await configureSmtpBackend({
      host,
      port,
      user,
      pass,
      fromName,
      fromEmail: fromEmail || user,
      secure
    });

    setIsSaving(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: '✅ SMTP connection established! Real emails can now be dispatched.' });
      if (onConfigured) onConfigured();
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatusMsg({ type: 'error', text: `❌ ${res.error || 'Failed to connect to SMTP server. Check credentials.'}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/30">
              ⚙️
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                SMTP / Outgoing Mail Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Connect Office 365, Gmail, or Anantdv SMTP to deliver real emails
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

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SMTP Host</label>
              <input
                required
                value={host}
                onChange={e => setHost(e.target.value)}
                placeholder="smtp.office365.com"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Port</label>
              <input
                required
                value={port}
                onChange={e => setPort(e.target.value)}
                placeholder="587"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Username / Email</label>
            <input
              required
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="e.g. notifications@anantdv.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password / App Password</label>
            <input
              required
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sender Name</label>
              <input
                value={fromName}
                onChange={e => setFromName(e.target.value)}
                placeholder="Anantdv Project Cockpit"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">From Email (Optional)</label>
              <input
                value={fromEmail}
                onChange={e => setFromEmail(e.target.value)}
                placeholder="Defaults to username"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">💡 Quick Presets:</p>
            <p>• <strong>Office 365 / Outlook:</strong> Host: <code>smtp.office365.com</code>, Port: <code>587</code></p>
            <p>• <strong>Gmail:</strong> Host: <code>smtp.gmail.com</code>, Port: <code>587</code> (requires App Password)</p>
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>{isSaving ? '⏳' : '💾'}</span>
              <span>{isSaving ? 'Verifying...' : 'Save & Verify Connection'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
