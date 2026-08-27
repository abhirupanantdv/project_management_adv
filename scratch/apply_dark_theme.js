const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'react_project_cockpit', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Body background
html = html.replace(
  'class="bg-[#f8fafc] text-slate-900 min-h-screen antialiased"',
  'class="bg-[#0b0f19] text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white"'
);

// 2. Scrollbar track in CSS
html = html.replace(
  '.custom-scrollbar::-webkit-scrollbar-track {\n      background: #f1f5f9;',
  '.custom-scrollbar::-webkit-scrollbar-track {\n      background: #0f172a;'
);
html = html.replace(
  '.custom-scrollbar::-webkit-scrollbar-thumb {\n      background: #cbd5e1;',
  '.custom-scrollbar::-webkit-scrollbar-thumb {\n      background: #334155;'
);

// 3. Dropzones
html = html.replace(
  'background-color: rgba(220, 252, 231, 0.6) !important;',
  'background-color: rgba(6, 78, 59, 0.6) !important;'
);
html = html.replace(
  'background-color: rgba(254, 243, 199, 0.6) !important;',
  'background-color: rgba(120, 53, 15, 0.6) !important;'
);
html = html.replace(
  'background-color: rgba(255, 228, 230, 0.6) !important;',
  'background-color: rgba(136, 19, 55, 0.6) !important;'
);

// 4. Navbar
html = html.replace(
  'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs',
  'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl'
);
html = html.replace(
  'text-[11px] text-slate-500 font-medium',
  'text-[11px] text-slate-400 font-medium'
);
html = html.replace(
  'bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700',
  'bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] font-semibold text-slate-200'
);
html = html.replace(
  'bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-900 hover:border-emerald-400',
  'bg-emerald-950/70 border border-emerald-800/80 rounded-xl text-[11px] font-bold text-emerald-300 hover:border-emerald-500'
);

// 5. Main View 2: 3-Card Dashboard
html = html.replace(
  /bg-white border border-slate-200\/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3\.5/g,
  'bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3.5 text-white'
);
html = html.replace(
  /bg-white border border-slate-200\/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3/g,
  'bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 text-white'
);

// 3-Card Dashboard inner styling
html = html.replace(
  /<span className="text-3xl font-black text-slate-900 font-display tracking-tight">/g,
  '<span className="text-3xl font-black text-white font-display tracking-tight">'
);
html = html.replace(
  /bg-slate-100 h-3 rounded-full overflow-hidden flex border border-slate-200\/60 p-0\.5/g,
  'bg-slate-800/90 h-3 rounded-full overflow-hidden flex border border-slate-700/60 p-0.5'
);
html = html.replace(
  /stroke="#f1f5f9"/g,
  'stroke="#1e293b"'
);
html = html.replace(
  /<span className="text-sm font-black text-slate-900 font-mono leading-none">/g,
  '<span className="text-sm font-black text-white font-mono leading-none">'
);
html = html.replace(
  /bg-slate-100 p-0\.5 rounded-xl text-\[10px\] font-bold border border-slate-200 shadow-2xs/g,
  'bg-slate-950 p-0.5 rounded-xl text-[10px] font-bold border border-slate-800 shadow-inner'
);
html = html.replace(
  /kpiPieMode === 'tasks' \? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'/g,
  "kpiPieMode === 'tasks' ? 'bg-slate-800 text-white shadow-xs font-black' : 'text-slate-400 hover:text-white'"
);
html = html.replace(
  /kpiPieMode === 'projects' \? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'/g,
  "kpiPieMode === 'projects' ? 'bg-slate-800 text-white shadow-xs font-black' : 'text-slate-400 hover:text-white'"
);

// Donut Breakdown List Pills
html = html.replace(
  /bg-emerald-50 text-emerald-950 border border-emerald-200/g,
  'bg-emerald-950/40 text-emerald-200 border border-emerald-800/60'
);
html = html.replace(
  /bg-amber-50 text-amber-950 border border-amber-200/g,
  'bg-amber-950/40 text-amber-200 border border-amber-800/60'
);
html = html.replace(
  /bg-rose-50 text-rose-950 border border-rose-200/g,
  'bg-rose-950/40 text-rose-200 border border-rose-800/60'
);

// 6. Search & Status Action Toolbar on Projects Page
html = html.replace(
  'bg-white border border-slate-200 rounded-2xl p-4 shadow-xs',
  'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl text-white'
);
html = html.replace(
  'bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
  'bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
);
html = html.replace(
  'bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0',
  'bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs shrink-0'
);
html = html.replace(
  "projectViewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'",
  "projectViewMode === 'kanban' ? 'bg-slate-800 text-blue-400 shadow-xs' : 'text-slate-400 hover:text-white'"
);
html = html.replace(
  "projectViewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'",
  "projectViewMode === 'grid' ? 'bg-slate-800 text-blue-400 shadow-xs' : 'text-slate-400 hover:text-white'"
);

// 7. Project Kanban Columns
html = html.replace(
  'bg-rose-50/40 border-2 rounded-3xl p-4 space-y-4 shadow-xs transition-all',
  'bg-rose-950/20 border-2 border-rose-900/40 rounded-3xl p-4 space-y-4 shadow-xl transition-all'
);
html = html.replace(
  'bg-amber-50/40 border-2 rounded-3xl p-4 space-y-4 shadow-xs transition-all',
  'bg-amber-950/20 border-2 border-amber-900/40 rounded-3xl p-4 space-y-4 shadow-xl transition-all'
);
html = html.replace(
  'bg-emerald-50/40 border-2 rounded-3xl p-4 space-y-4 shadow-xs transition-all',
  'bg-emerald-950/20 border-2 border-emerald-900/40 rounded-3xl p-4 space-y-4 shadow-xl transition-all'
);

// Project Kanban Cards
html = html.replace(
  /group bg-white border border-rose-200\/90 rounded-2xl p-4 shadow-xs hover:shadow-lg hover:border-rose-400 transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\]/g,
  'group bg-slate-900/95 border border-rose-900/50 hover:border-rose-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);
html = html.replace(
  /group bg-white border border-amber-200\/90 rounded-2xl p-4 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\]/g,
  'group bg-slate-900/95 border border-amber-900/50 hover:border-amber-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);
html = html.replace(
  /group bg-white border border-emerald-200\/90 rounded-2xl p-4 shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-\[1\.01\]/g,
  'group bg-slate-900/95 border border-emerald-900/50 hover:border-emerald-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-3 cursor-grab active:cursor-grabbing hover:scale-[1.01] text-white'
);

// Project Kanban Card Titles & Footers
html = html.replace(
  /<h4 className="text-\[14\.5px\] font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2 select-text">/g,
  '<h4 className="text-[14.5px] font-extrabold text-white tracking-tight leading-snug line-clamp-2 select-text">'
);
html = html.replace(
  /border-t border-slate-100/g,
  'border-t border-slate-800'
);

// 8. Cards View (Category Tabs & List View Cards)
html = html.replace(
  /cardCategoryTab === 'notOpen'\s*\?\s*'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'\s*:\s*'bg-white hover:bg-rose-50\/50 text-slate-800 border-rose-200 hover:border-rose-300'/g,
  "cardCategoryTab === 'notOpen' ? 'bg-rose-600 text-white border-rose-500 shadow-lg ring-2 ring-rose-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-rose-900/60 hover:border-rose-500 shadow-md'"
);
html = html.replace(
  /cardCategoryTab === 'working'\s*\?\s*'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'\s*:\s*'bg-white hover:bg-amber-50\/50 text-slate-800 border-amber-200 hover:border-amber-300'/g,
  "cardCategoryTab === 'working' ? 'bg-amber-600 text-white border-amber-500 shadow-lg ring-2 ring-amber-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-amber-900/60 hover:border-amber-500 shadow-md'"
);
html = html.replace(
  /cardCategoryTab === 'completed'\s*\?\s*'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'\s*:\s*'bg-white hover:bg-emerald-50\/50 text-slate-800 border-emerald-200 hover:border-emerald-300'/g,
  "cardCategoryTab === 'completed' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg ring-2 ring-emerald-400/50' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-emerald-900/60 hover:border-emerald-500 shadow-md'"
);

// List View Row Cards in Cards View
html = html.replace(
  "const cardBg = isProjDone\n                                  ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'\n                                  : isProjWorking\n                                  ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'\n                                  : 'bg-rose-50/70 border-rose-300 hover:border-rose-500';",
  "const cardBg = isProjDone\n                                  ? 'bg-slate-900/95 border-emerald-900/60 hover:border-emerald-500'\n                                  : isProjWorking\n                                  ? 'bg-slate-900/95 border-amber-900/60 hover:border-amber-500'\n                                  : 'bg-slate-900/95 border-rose-900/60 hover:border-rose-500';"
);
html = html.replace(
  "const titleColor = isProjDone\n                                  ? 'text-emerald-950'\n                                  : isProjWorking\n                                  ? 'text-amber-950'\n                                  : 'text-rose-950';",
  "const titleColor = 'text-white';"
);

// List View switcher box
html = html.replace(
  'bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold',
  'bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-xl text-xs font-bold'
);
html = html.replace(
  "cardLayoutMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'",
  "cardLayoutMode === 'list' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'"
);
html = html.replace(
  "cardLayoutMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'",
  "cardLayoutMode === 'grid' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'"
);

// Footer load more block
html = html.replace(
  'bg-white border border-slate-200 rounded-3xl text-center space-y-3 shadow-xs',
  'bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-3 shadow-xl text-slate-300'
);

// 9. Task 5-Category Progress Summary Strip
html = html.replace(
  "isSelectedCat ? 'border-blue-400 ring-2 ring-blue-300' : 'border-slate-200/90'",
  "isSelectedCat ? 'border-blue-400 ring-2 ring-blue-500/40 bg-slate-800' : 'border-slate-800 bg-slate-900/90'"
);
html = html.replace(
  /className="text-xs font-black text-slate-800"/g,
  'className="text-xs font-black text-white"'
);
html = html.replace(
  /className="font-mono text-xs font-black text-slate-900"/g,
  'className="font-mono text-xs font-black text-white"'
);
html = html.replace(
  /w-full bg-slate-100 h-2 rounded-full overflow-hidden/g,
  'w-full bg-slate-800 h-2 rounded-full overflow-hidden'
);

// Task Controls & View Switcher Toolbar
html = html.replace(
  'bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3',
  'bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 text-white'
);
html = html.replace(
  'w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500',
  'w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500'
);

// Task Kanban Columns
html = html.replace(
  'bg-emerald-50/40 border-2 rounded-3xl p-4 space-y-4 shadow-xs',
  'bg-emerald-950/20 border-2 border-emerald-900/40 rounded-3xl p-4 space-y-4 shadow-xl'
);
html = html.replace(
  'bg-rose-50/40 border-2 rounded-3xl p-4 space-y-4 shadow-xs',
  'bg-rose-950/20 border-2 border-rose-900/40 rounded-3xl p-4 space-y-4 shadow-xl'
);

// Task Cards in renderTaskCard
html = html.replace(
  'bg-white border rounded-2xl p-4 shadow-xs hover:shadow-lg transition-all space-y-2.5',
  'bg-slate-900/95 border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all space-y-2.5 text-white'
);
html = html.replace(
  'text-[13.5px] font-bold text-slate-900 leading-snug',
  'text-[13.5px] font-bold text-white leading-snug'
);
html = html.replace(
  'text-[11.5px] text-slate-500 leading-relaxed',
  'text-[11.5px] text-slate-400 leading-relaxed'
);

// Modals
html = html.replace(
  /fixed inset-0 z-50 bg-slate-900\/60 backdrop-blur-xs flex items-center justify-center p-4/g,
  'fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4'
);
html = html.replace(
  /bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in/g,
  'bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fade-in text-white'
);
html = html.replace(
  /bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in/g,
  'bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in text-white'
);
html = html.replace(
  /bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fade-in/g,
  'bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fade-in text-white'
);
html = html.replace(
  /bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-fade-in max-h-\[90vh\] overflow-y-auto custom-scrollbar/g,
  'bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar text-white'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Dark theme color scheme successfully applied across entire app!');
