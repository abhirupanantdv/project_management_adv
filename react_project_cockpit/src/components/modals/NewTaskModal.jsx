import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/initialData.js';

export default function NewTaskModal({
  isOpen,
  onClose,
  projects,
  selectedProjectId,
  onAddTask
}) {
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Development');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Open');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (selectedProjectId) {
      setProjectId(selectedProjectId);
    } else if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [selectedProjectId, projects]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === projectId);
  const possibleAssignees = currentProject?.assignedUsers?.map(u => u.name) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !projectId || !category || !assignee.trim() || !priority || !status || !dueDate) {
      alert("Please fill in all mandatory fields (Subject, Project, Category, Assignee, Priority, Status, Due Date).");
      return;
    }

    onAddTask({
      projectId,
      subject: subject.trim(),
      category,
      assignee: assignee.trim(),
      priority,
      status,
      exp_end_date: dueDate,
      expectedEndDate: dueDate,
      dueDate
    });

    setSubject('');
    setAssignee('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-850 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-slide-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base">📝</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Create New Task
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              ERPNext Task DocType • Mandatory Fields Only
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Mandatory Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Subject (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Implement Multi-Tenant OAuth Authentication"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* 2. Project (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project <span className="text-rose-500 font-bold">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.id}] {p.name} ({p.customer || 'Enterprise'})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category & 4. Assignee (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                required
              >
                {Object.values(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assignee <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Assignee name or email"
                list="modal-assignees-list"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                required
              />
              <datalist id="modal-assignees-list">
                {possibleAssignees.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* 5. Priority & 6. Status (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                required
              >
                <option value="Urgent">🔥 Urgent</option>
                <option value="High">▲ High</option>
                <option value="Medium">● Medium</option>
                <option value="Low">▽ Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                required
              >
                <option value="Open">Open</option>
                <option value="Working">Working / In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* 7. Due Date (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Due Date (`exp_end_date`) <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition shadow-sm shadow-indigo-500/20"
            >
              Save to ERPNext Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
