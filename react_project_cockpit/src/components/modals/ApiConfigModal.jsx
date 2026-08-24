import React, { useState } from 'react';

export default function ApiConfigModal({
  isOpen,
  onClose,
  apiConfig,
  setApiConfig,
  onTestConnection,
  connectionStatus
}) {
  const [baseUrl, setBaseUrl] = useState(apiConfig.baseUrl || 'http://192.168.101.125');
  const [apiKey, setApiKey] = useState(apiConfig.apiKey || '');
  const [apiSecret, setApiSecret] = useState(apiConfig.apiSecret || '');
  const [isLive, setIsLive] = useState(apiConfig.isLive || false);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiConfig({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      apiSecret: apiSecret.trim(),
      isLive
    });
    onClose();
  };

  const handleTest = async () => {
    setIsTesting(true);
    await onTestConnection({ baseUrl, apiKey, apiSecret });
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

      <div className="relative bg-white dark:bg-slate-850 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>⚙️</span>
            <span>ERPNext REST API Configuration</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ERPNext Instance Base URL *
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://192.168.101.125 or https://erp.yourdomain.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Points to ERPNext root where REST endpoints (`/api/resource/Project`, `/api/resource/Task`) reside.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="User API Key"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="User API Secret"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Toggle Live Remote Sync */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Enable Live Remote Sync
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                When enabled, task updates persist directly to ERPNext DocTypes via REST API.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Connection Test Status Message */}
          {connectionStatus?.tested && (
            <div className={`p-3 rounded-lg text-xs font-semibold border ${
              connectionStatus.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {connectionStatus.success ? '✅ ' : '❌ '}
              {connectionStatus.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
            >
              {isTesting ? 'Testing...' : '⚡ Test Connection'}
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
