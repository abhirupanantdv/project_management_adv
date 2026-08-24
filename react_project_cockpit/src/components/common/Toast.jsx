import React from 'react';

export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all ${
        isSuccess
          ? 'bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-emerald-300 dark:border-emerald-900/50'
          : isError
          ? 'bg-rose-900 text-rose-100 border-rose-700'
          : 'bg-slate-900 text-slate-100 border-slate-700'
      }`}>
        <span>{isSuccess ? '✅' : isError ? '❌' : 'ℹ️'}</span>
        <span>{notification.msg}</span>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white ml-2 text-xs">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
