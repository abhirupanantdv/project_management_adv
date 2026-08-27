const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'react_project_cockpit', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Canvas & Body Background
html = html.replace(
  'class="bg-[#0b0f19] text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white"',
  'class="bg-[#070b14] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black"'
);

// 2. Navbar Logo & Gradient
html = html.replace(
  'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
  'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent'
);
html = html.replace(
  'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl',
  'bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-800 shadow-2xl'
);
html = html.replace(
  'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer',
  'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer border border-blue-500/30'
);

// 3. 3-Card Dashboard Cards
html = html.replace(
  /bg-slate-900\/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3\.5 text-white/g,
  'bg-[#0d1424]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3.5 text-white'
);
html = html.replace(
  /bg-slate-900\/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 text-white/g,
  'bg-[#0d1424]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 text-white'
);

// 4. Project Search Toolbar
html = html.replace(
  'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl text-white',
  'bg-[#0d1424]/90 border border-slate-800 rounded-2xl p-4 shadow-2xl text-white'
);
html = html.replace(
  'bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
  'bg-[#070b14]/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
);

// 5. Kanban Cards & Columns
html = html.replace(
  /bg-slate-900\/95 border border-rose-900\/50 hover:border-rose-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\] text-white/g,
  'bg-[#0f172a]/95 border border-rose-900/40 hover:border-rose-500/80 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);
html = html.replace(
  /bg-slate-900\/95 border border-amber-900\/50 hover:border-amber-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\] text-white/g,
  'bg-[#0f172a]/95 border border-amber-900/40 hover:border-amber-500/80 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);
html = html.replace(
  /bg-slate-900\/95 border border-emerald-900\/50 hover:border-emerald-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\] text-white/g,
  'bg-[#0f172a]/95 border border-emerald-900/40 hover:border-emerald-500/80 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);

// 6. Category Tabs in Cards View
html = html.replace(
  "cardCategoryTab === 'notOpen' ? 'bg-rose-600 text-white border-rose-500 shadow-lg ring-2 ring-rose-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-rose-900/60 hover:border-rose-500 shadow-md'",
  "cardCategoryTab === 'notOpen' ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500 shadow-xl ring-2 ring-rose-500/40 shadow-rose-950/50' : 'bg-[#0d1424]/90 hover:bg-slate-800 text-white border-rose-900/50 hover:border-rose-500 shadow-md'"
);
html = html.replace(
  "cardCategoryTab === 'working' ? 'bg-amber-600 text-white border-amber-500 shadow-lg ring-2 ring-amber-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-amber-900/60 hover:border-amber-500 shadow-md'",
  "cardCategoryTab === 'working' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-xl ring-2 ring-amber-500/40 shadow-amber-950/50' : 'bg-[#0d1424]/90 hover:bg-slate-800 text-white border-amber-900/50 hover:border-amber-500 shadow-md'"
);
html = html.replace(
  "cardCategoryTab === 'completed' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-emerald-900/60 hover:border-emerald-500 shadow-md'",
  "cardCategoryTab === 'completed' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/40 shadow-emerald-950/50' : 'bg-[#0d1424]/90 hover:bg-slate-800 text-white border-emerald-900/50 hover:border-emerald-500 shadow-md'"
);

// 7. List View Cards in Cards View
html = html.replace(
  "const cardBg = isProjDone\n                                  ? 'bg-slate-900/95 border-emerald-900/60 hover:border-emerald-500'\n                                  : isProjWorking\n                                  ? 'bg-slate-900/95 border-amber-900/60 hover:border-amber-500'\n                                  : 'bg-slate-900/95 border-rose-900/60 hover:border-rose-500';",
  "const cardBg = isProjDone\n                                  ? 'bg-[#0f172a]/95 border-emerald-900/40 hover:border-emerald-500/80'\n                                  : isProjWorking\n                                  ? 'bg-[#0f172a]/95 border-amber-900/40 hover:border-amber-500/80'\n                                  : 'bg-[#0f172a]/95 border-rose-900/40 hover:border-rose-500/80';"
);

// Open Tasks Button in List View - make it cyan/blue gradient
html = html.replace(
  'py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs shadow-slate-900/20 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 group/btn border border-slate-800',
  'py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-900/30 transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 group/btn border border-blue-500/40'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Obsidian and cyber neon palette applied successfully!');
