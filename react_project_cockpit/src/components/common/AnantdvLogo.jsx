import React from 'react';

// Default logo configuration helper
export const DEFAULT_LOGO_CONFIG = {
  preset: 'auto', // 'auto' | 'modern' | 'dark' | 'original' | 'dynamic_vector' | 'custom'
  customUrl: '',
  brandName: 'anantdv',
  tagline: 'enhancing minds',
  showTagline: true,
  glowEffect: 'subtle', // 'none' | 'subtle' | 'pulse' | 'neon'
  glowColor: 'cyan', // 'cyan' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rainbow'
  accentGradient: 'default' // 'default' | 'ocean' | 'sunset' | 'emerald' | 'cyberpunk'
};

export const getStoredLogoConfig = () => {
  try {
    const saved = localStorage.getItem('anantdv_logo_config');
    if (saved) return { ...DEFAULT_LOGO_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    console.warn('Could not read logo config from localStorage', e);
  }
  return DEFAULT_LOGO_CONFIG;
};

export const saveStoredLogoConfig = (config) => {
  try {
    localStorage.setItem('anantdv_logo_config', JSON.stringify(config));
  } catch (e) {
    console.warn('Could not save logo config to localStorage', e);
  }
};

export default function AnantdvLogo({
  darkMode = false,
  config = null,
  onOpenCustomizer = null,
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const currentConfig = config || DEFAULT_LOGO_CONFIG;
  const {
    preset = 'auto',
    customUrl = '',
    brandName = 'anantdv',
    tagline = 'enhancing minds',
    showTagline = true,
    glowEffect = 'subtle',
    glowColor = 'cyan',
    accentGradient = 'default'
  } = currentConfig;

  // Resolve image source based on preset & theme
  let imageSrc = '/anantdv_logo.png';
  if (preset === 'dark') {
    imageSrc = '/anantdv_logo_dark.png';
  } else if (preset === 'original') {
    imageSrc = '/anantdv_logo_backup.png';
  } else if (preset === 'modern') {
    imageSrc = '/anantdv_logo.png';
  } else if (preset === 'custom' && customUrl) {
    imageSrc = customUrl;
  } else {
    // 'auto'
    imageSrc = darkMode ? '/anantdv_logo_dark.png' : '/anantdv_logo.png';
  }

  // Glow color mapping
  const glowColorClasses = {
    cyan: 'from-cyan-500/20 via-blue-500/20 to-teal-500/10 shadow-cyan-500/15',
    indigo: 'from-indigo-500/25 via-blue-600/20 to-purple-500/15 shadow-indigo-500/20',
    purple: 'from-purple-500/25 via-fuchsia-500/20 to-pink-500/15 shadow-purple-500/20',
    emerald: 'from-emerald-500/25 via-teal-500/20 to-green-500/15 shadow-emerald-500/20',
    amber: 'from-amber-500/25 via-orange-500/20 to-yellow-500/15 shadow-amber-500/20',
    rainbow: 'from-blue-500/25 via-purple-500/25 to-pink-500/25 shadow-purple-500/20'
  };

  const glowShadow = glowColorClasses[glowColor] || glowColorClasses.cyan;

  // Size styling
  const sizeMap = {
    sm: { container: 'h-9 px-2 py-0.5', img: 'h-6 max-w-[105px]', text: 'text-sm' },
    md: { container: 'h-10 sm:h-11 px-2.5 py-1', img: 'h-7 sm:h-8 max-w-[130px] sm:max-w-[150px]', text: 'text-base sm:text-lg' },
    lg: { container: 'h-12 sm:h-14 px-3.5 py-1.5', img: 'h-9 sm:h-11 max-w-[160px] sm:max-w-[200px]', text: 'text-xl' }
  };
  const curSize = sizeMap[size] || sizeMap.md;

  // Custom SVG Vector Logo Variant
  const renderDynamicVector = () => {
    return (
      <div className="flex items-center gap-2 select-none">
        <div className="relative flex items-center justify-center">
          {/* Animated Glow Portal */}
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${glowShadow} blur-md ${glowEffect === 'pulse' ? 'animate-pulse' : ''}`}></div>
          
          <svg className="h-8 w-auto relative" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="anantdvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={darkMode ? "#38bdf8" : "#0284c7"} />
                <stop offset="50%" stopColor={darkMode ? "#818cf8" : "#4f46e5"} />
                <stop offset="100%" stopColor={darkMode ? "#c084fc" : "#9333ea"} />
              </linearGradient>
              <linearGradient id="rainbowSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="25%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Orbiting particle ring */}
            <circle cx="178" cy="35" r="24" stroke="url(#anantdvGrad)" strokeWidth="2.5" strokeDasharray="4 3" className="animate-[spin_20s_linear_infinite]" opacity="0.8" />
            <circle cx="178" cy="35" r="18" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" strokeDasharray="2 4" />

            {/* Wordmark */}
            <text x="10" y="44" fontFamily="Outfit, Inter, sans-serif" fontWeight="900" fontSize="38" fill={darkMode ? "#f8fafc" : "#0f172a"} letterSpacing="-1">
              {brandName}
            </text>

            {/* Central core emblem inside 'd' */}
            <circle cx="152" cy="33" r="7" fill={darkMode ? "#1e293b" : "#f1f5f9"} stroke="url(#anantdvGrad)" strokeWidth="2" />
            <circle cx="152" cy="33" r="3" fill="#38bdf8" />

            {/* Rainbow curve sweep */}
            <path d="M 25 48 Q 110 65 195 46" stroke="url(#rainbowSweep)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Tagline */}
            {showTagline && tagline && (
              <text x="110" y="62" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="10" fill={darkMode ? "#94a3b8" : "#475569"} letterSpacing="1">
                {tagline.toLowerCase()}
              </text>
            )}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative group flex items-center ${className}`}>
      {/* Background glow ambient */}
      {glowEffect !== 'none' && (
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${glowShadow} blur-md opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none ${glowEffect === 'pulse' ? 'animate-pulse' : ''}`}></div>
      )}

      {/* Main Logo Container */}
      <div className={`relative ${curSize.container} bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-center shrink-0 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-all`}>
        {preset === 'dynamic_vector' ? (
          renderDynamicVector()
        ) : (
          <img
            src={imageSrc}
            alt={brandName}
            className={`${curSize.img} w-auto object-contain transition-all duration-300 group-hover:scale-102`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = darkMode ? '/anantdv_logo_dark.png' : '/anantdv_logo.png';
            }}
          />
        )}

        {/* Quick Customize Badge Overlay on hover */}
        {onOpenCustomizer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCustomizer();
            }}
            className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1 shadow-md hover:shadow-indigo-500/40 z-20 cursor-pointer"
            title="Customize Logo"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
