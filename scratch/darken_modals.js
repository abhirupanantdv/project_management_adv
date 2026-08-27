const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'react_project_cockpit', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Project Details Modal styling
html = html.replace(
  '<div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl space-y-0 animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">',
  '<div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl space-y-0 animate-fade-in max-h-[90vh] overflow-hidden flex flex-col text-white">'
);
html = html.replace(
  'div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50"',
  'div className="p-6 pb-4 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-950/80"'
);
html = html.replace(
  'font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 shadow-2xs',
  'font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-white shadow-2xs'
);
html = html.replace(
  'text-lg font-extrabold text-slate-900 tracking-tight leading-snug',
  'text-lg font-extrabold text-white tracking-tight leading-snug'
);
html = html.replace(
  'p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 space-y-2.5 shadow-2xs',
  'p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2.5 shadow-2xs'
);
html = html.replace(
  'text-xs font-extrabold text-slate-700 uppercase tracking-wider',
  'text-xs font-extrabold text-slate-300 uppercase tracking-wider'
);
html = html.replace(
  'font-mono text-base font-black text-slate-900',
  'font-mono text-base font-black text-white'
);
html = html.replace(
  'w-full bg-slate-200 h-3 rounded-full overflow-hidden',
  'w-full bg-slate-800 h-3 rounded-full overflow-hidden'
);
html = html.replace(
  'span className="font-bold text-slate-700">Company:',
  'span className="font-bold text-slate-300">Company:'
);

// Worker cards in modal
html = html.replace(
  "isOwner ? 'bg-purple-50/80 border-purple-200' : 'bg-white border-slate-200/80'",
  "isOwner ? 'bg-purple-950/40 border-purple-800/60' : 'bg-slate-800/80 border-slate-700/80 text-white'"
);
html = html.replace(
  'font-extrabold text-slate-900 text-xs truncate flex items-center gap-1',
  'font-extrabold text-white text-xs truncate flex items-center gap-1'
);
html = html.replace(
  'bg-slate-100 text-slate-700 shrink-0',
  'bg-slate-900 text-slate-300 border border-slate-700 shrink-0'
);

// Modal footer
html = html.replace(
  'p-4 px-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80',
  'p-4 px-6 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80'
);
html = html.replace(
  'px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer',
  'px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-2xs transition-colors cursor-pointer'
);

// Form inputs in Create New Task / Create Project modals
html = html.replace(
  /className="w-full px-3\.5 py-2\.5 border rounded-xl bg-slate-50 border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"/g,
  'className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-950 border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"'
);
html = html.replace(
  /className="w-full px-3\.5 py-2\.5 border rounded-xl bg-slate-50 border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"/g,
  'className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-950 border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"'
);
html = html.replace(
  /className="w-full px-3\.5 py-2\.5 border rounded-xl bg-slate-50 border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"/g,
  'className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-950 border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"'
);
html = html.replace(
  /className="w-full px-3\.5 py-2\.5 border rounded-xl bg-slate-50 border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-blue-700"/g,
  'className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-950 border-slate-700 text-blue-400 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"'
);
html = html.replace(
  /className="block font-bold text-slate-700 mb-1\.5"/g,
  'className="block font-bold text-slate-300 mb-1.5"'
);
html = html.replace(
  /className="block font-bold text-slate-700 mb-1"/g,
  'className="block font-bold text-slate-300 mb-1"'
);
html = html.replace(
  /border-t border-slate-100/g,
  'border-t border-slate-800'
);
html = html.replace(
  /border-b border-slate-100/g,
  'border-b border-slate-800'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Modals and form inputs darkened successfully!');
