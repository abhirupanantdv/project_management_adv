import React, { useState } from 'react';
import AnantdvLogo, { DEFAULT_LOGO_CONFIG, saveStoredLogoConfig } from '../common/AnantdvLogo';

export default function LogoCustomizerModal({
  isOpen,
  onClose,
  logoConfig,
  setLogoConfig,
  darkMode,
  setDarkMode
}) {
  const [draftConfig, setDraftConfig] = useState({ ...logoConfig });
  const [customFileError, setCustomFileError] = useState('');

  if (!isOpen) return null;

  const handlePresetSelect = (presetKey) => {
    setDraftConfig((prev) => ({ ...prev, preset: presetKey }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCustomFileError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setCustomFileError('Image size exceeds 2MB limit.');
      return;
    }

    setCustomFileError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setDraftConfig((prev) => ({
        ...prev,
        preset: 'custom',
        customUrl: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLogoConfig(draftConfig);
    saveStoredLogoConfig(draftConfig);
    onClose();
  };

  const handleReset = () => {
    setDraftConfig({ ...DEFAULT_LOGO_CONFIG });
    setLogoConfig(DEFAULT_LOGO_CONFIG);
    saveStoredLogoConfig(DEFAULT_LOGO_CONFIG);
  };

  const presets = [
    {
      id: 'auto',
      title: 'Smart Adaptive (Auto)',
      description: 'Switches between Modern Light & Executive Chrome Dark automatically',
      icon: '🌓',
      previewImg: darkMode ? '/anantdv_logo_dark.png' : '/anantdv_logo.png'
    },
    {
      id: 'modern',
      title: 'Modern Enhanced Light',
      description: 'Vibrant cyan/blue digital vortex with rainbow light trail on clean white',
      icon: '☀️',
      previewImg: '/anantdv_logo.png'
    },
    {
      id: 'dark',
      title: 'Executive Cyber Dark',
      description: '3D metallic chrome lettering with illuminated electric neon halo',
      icon: '✨',
      previewImg: '/anantdv_logo_dark.png'
    },
    {
      id: 'dynamic_vector',
      title: 'Dynamic Scalable Vector',
      description: 'Crisp SVG render with live gradient and spinning orbit particle ring',
      icon: '⚡',
      isVector: true
    },
    {
      id: 'original',
      title: 'Classic Brand Original',
      description: 'The baseline original Anantdv wordmark and pastel sweep',
      icon: '🏛️',
      previewImg: '/anantdv_logo_backup.png'
    },
    {
      id: 'custom',
      title: 'Custom Upload / URL',
      description: 'Upload your own corporate logo image or provide custom link',
      icon: '🖼️'
    }
  ];

  const glowColors = [
    { id: 'cyan', label: 'Cyan Aura', bg: 'bg-cyan-500' },
    { id: 'indigo', label: 'Indigo Tech', bg: 'bg-indigo-500' },
    { id: 'purple', label: 'Purple Neon', bg: 'bg-purple-500' },
    { id: 'emerald', label: 'Emerald Flow', bg: 'bg-emerald-500' },
    { id: 'amber', label: 'Golden Amber', bg: 'bg-amber-500' },
    { id: 'rainbow', label: 'Rainbow Glow', bg: 'bg-gradient-to-r from-blue-500 via-pink-500 to-amber-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-base">
              🎨
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Logo Customizer & Brand Styles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize the cockpit brand emblem, styles, glow aura, and presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>LIVE PREVIEW</span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              <span>{darkMode ? '☀️ Preview Light' : '🌙 Preview Dark'}</span>
            </button>
          </div>
          <div className="flex items-center justify-center py-4 bg-white/70 dark:bg-slate-900/90 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
            <AnantdvLogo
              darkMode={darkMode}
              config={draftConfig}
              size="lg"
            />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Preset Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Select Logo Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((p) => {
                const isSelected = draftConfig.preset === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePresetSelect(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <span className="text-xl shrink-0">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.title}
                        </h4>
                        {isSelected && (
                          <span className="text-[10px] bg-indigo-600 text-white font-black px-1.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Upload or URL (if custom preset chosen) */}
          {draftConfig.preset === 'custom' && (
            <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Custom Logo Image
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-600 dark:text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">or enter an image URL:</div>
              <input
                type="url"
                placeholder="https://example.com/my-logo.png"
                value={draftConfig.customUrl || ''}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, customUrl: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
              {customFileError && (
                <p className="text-xs text-rose-500 font-semibold">{customFileError}</p>
              )}
            </div>
          )}

          {/* Tagline & Brand Text Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand Name / Wordmark
              </label>
              <input
                type="text"
                value={draftConfig.brandName || ''}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, brandName: e.target.value }))}
                placeholder="anantdv"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tagline Subtitle
              </label>
              <input
                type="text"
                value={draftConfig.tagline || ''}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="enhancing minds"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Glow Effect & Color Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Aura Glow Style
              </label>
              <select
                value={draftConfig.glowEffect}
                onChange={(e) => setDraftConfig((prev) => ({ ...prev, glowEffect: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                <option value="none">None (Clean Minimal)</option>
                <option value="subtle">Subtle Glow</option>
                <option value="pulse">Breathing Pulse</option>
                <option value="neon">High-Intensity Neon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Aura Glow Color
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {glowColors.map((gc) => {
                  const isCur = draftConfig.glowColor === gc.id;
                  return (
                    <button
                      key={gc.id}
                      type="button"
                      onClick={() => setDraftConfig((prev) => ({ ...prev, glowColor: gc.id }))}
                      className={`w-6 h-6 rounded-full ${gc.bg} transition-all cursor-pointer relative ${
                        isCur ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={gc.label}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition cursor-pointer"
            >
              Reset to Defaults
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/25 transition cursor-pointer"
              >
                Save Logo Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
