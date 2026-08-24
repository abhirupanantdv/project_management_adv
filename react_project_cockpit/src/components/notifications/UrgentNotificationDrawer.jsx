import React, { useState } from 'react';

export default function UrgentNotificationDrawer({
  isOpen,
  onClose,
  urgentTasks,
  onNotifyPerson,
  onNotifyAll,
  onNavigateToProject
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'by_person'
  const [notifiedTaskIds, setNotifiedTaskIds] = useState({});
  const [copiedTaskId, setCopiedTaskId] = useState(null);

  if (!isOpen) return null;

  // Group tasks by assignee name
  const tasksByAssignee = urgentTasks.reduce((acc, task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    if (!acc[assigneeName]) {
      acc[assigneeName] = {
        name: assigneeName,
        avatar: typeof task.assignee === 'object' && task.assignee?.avatar ? task.assignee.avatar : assigneeName.slice(0, 2).toUpperCase(),
        tasks: []
      };
    }
    acc[assigneeName].tasks.push(task);
    return acc;
  }, {});

  const handleSingleNotify = (task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    setNotifiedTaskIds(prev => ({ ...prev, [task.id]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }));
    if (onNotifyPerson) {
      onNotifyPerson(assigneeName, task);
    }
  };

  const handleCopyMessage = (task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    const message = `🚨 *URGENT TASK NOTIFICATION*\n👤 Assigned To: @${assigneeName}\n📁 Project: ${task.projectId} - ${task.projectName}\n📌 Task: ${task.name || task.subject}\n📅 Due Date: ${task.dueDate || 'Immediate'}\n⚡ Status: ${task.status}\n\n⚠️ This task has been marked as URGENT. Please prioritize execution immediately!`;
    navigator.clipboard.writeText(message);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2500);
    if (onNotifyPerson) {
      onNotifyPerson(assigneeName, task, true);
    }
  };

  const handleNotifyAllClick = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const allNotified = {};
    urgentTasks.forEach(t => { allNotified[t.id] = timeStr; });
    setNotifiedTaskIds(allNotified);
    if (onNotifyAll) {
      onNotifyAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in flex justify-end">
      
      {/* Background click to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full transform transition-all duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent dark:from-rose-950/40 dark:via-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-500/30 animate-pulse">
                🚨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Urgent Task Notifications
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-rose-600 text-white">
                    {urgentTasks.length} Urgent
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct notification dispatch system for assigned team members
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

          {/* Quick Action: Notify All */}
          {urgentTasks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-rose-200/50 dark:border-rose-900/40 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                {Object.keys(tasksByAssignee).length} assignees require urgent attention
              </span>
              <button
                onClick={handleNotifyAllClick}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>📢</span>
                <span>Notify All Assignees</span>
              </button>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              All Urgent Tasks ({urgentTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('by_person')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'by_person'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Grouped by Assignee ({Object.keys(tasksByAssignee).length})
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {urgentTasks.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 text-2xl flex items-center justify-center">
                ✅
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Urgent Pending Tasks!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                All high-priority and urgent tasks are completed or there are no urgent bottlenecks.
              </p>
            </div>
          ) : activeTab === 'all' ? (
            
            /* View 1: Flat List of all Urgent Tasks */
            <div className="space-y-3.5">
              {urgentTasks.map((task) => {
                const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
                const assigneeAvatar = typeof task.assignee === 'object' && task.assignee?.avatar ? task.assignee.avatar : assigneeName.slice(0, 2).toUpperCase();
                const wasNotified = notifiedTaskIds[task.id];

                return (
                  <div
                    key={`${task.projectId}-${task.id}`}
                    className="p-4 rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                          {task.id}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-rose-600 text-white animate-pulse">
                          🔥 Urgent
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigateToProject && onNavigateToProject(task.projectId)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Jump to project details"
                      >
                        <span>{task.projectId}</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Task Title */}
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {task.name || task.subject}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Project: <strong className="text-slate-700 dark:text-slate-300">{task.projectName}</strong>
                      </p>
                    </div>

                    {/* Assignee & Due Date Row */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-[9px] flex items-center justify-center shadow-2xs">
                          {assigneeAvatar}
                        </div>
                        <div className="leading-tight">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Assigned To</span>
                          <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">{assigneeName}</strong>
                        </div>
                      </div>

                      <div className="text-right leading-tight font-mono">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Due Date</span>
                        <strong className="text-xs font-bold text-rose-700 dark:text-rose-300">📅 {task.dueDate || 'ASAP'}</strong>
                      </div>
                    </div>

                    {/* Notification Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="text-[11px] text-slate-500">
                        {wasNotified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>✅ Notified at {wasNotified}</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            ⚡ Notification Pending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(task)}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1"
                          title="Copy message to paste in Slack/Teams/Email"
                        >
                          <span>{copiedTaskId === task.id ? '✓' : '💬'}</span>
                          <span>{copiedTaskId === task.id ? 'Copied!' : 'Copy Msg'}</span>
                        </button>

                        <button
                          onClick={() => handleSingleNotify(task)}
                          className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>Notify {assigneeName.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          ) : (

            /* View 2: Grouped by Assigned Person */
            <div className="space-y-4">
              {Object.values(tasksByAssignee).map((person) => {
                return (
                  <div
                    key={person.name}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-xs space-y-3"
                  >
                    {/* Person Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {person.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {person.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {person.tasks.length} urgent {person.tasks.length === 1 ? 'task' : 'tasks'} assigned
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                          const newNotified = { ...notifiedTaskIds };
                          person.tasks.forEach(t => { newNotified[t.id] = timeStr; });
                          setNotifiedTaskIds(newNotified);
                          if (onNotifyPerson) {
                            onNotifyPerson(person.name, person.tasks[0], false, true);
                          }
                        }}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>⚡</span>
                        <span>Notify {person.name.split(' ')[0]}</span>
                      </button>
                    </div>

                    {/* Person's Urgent Tasks List */}
                    <div className="space-y-2">
                      {person.tasks.map(task => {
                        const wasNotified = notifiedTaskIds[task.id];
                        return (
                          <div
                            key={task.id}
                            className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-rose-700 dark:text-rose-300">
                                  {task.id}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                                  {task.projectId}
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                                {task.name || task.subject}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Due: {task.dueDate || 'N/A'} • Status: {task.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleSingleNotify(task)}
                                className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[11px] rounded-lg shadow-2xs hover:bg-rose-700 transition"
                                title="Send urgent notification"
                              >
                                {wasNotified ? 'Resend ⚡' : 'Notify ⚡'}
                              </button>

                              <button
                                onClick={() => onNavigateToProject && onNavigateToProject(task.projectId)}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                                title="Open project"
                              >
                                ↗
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>

          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-Time Urgency Watchdog Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
}
