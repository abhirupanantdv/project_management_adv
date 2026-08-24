import React, { useState } from 'react';
import { getPersonEmail, generateTaskReminderEmail, getDailyReminderStatus } from '../../services/reminderEmailService.js';

export default function UrgentNotificationDrawer({
  isOpen,
  onClose,
  urgentTasks,
  onNotifyPerson,
  onSendEmailReminder,
  onRunDailyReminders,
  onNavigateToProject
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'by_person' | 'email_schedule'
  const [notifiedTaskIds, setNotifiedTaskIds] = useState({});
  const [copiedTaskId, setCopiedTaskId] = useState(null);

  if (!isOpen) return null;

  const dailyStatus = getDailyReminderStatus();

  // Group tasks by assignee name
  const tasksByAssignee = urgentTasks.reduce((acc, task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    const email = getPersonEmail(assigneeName);
    if (!acc[assigneeName]) {
      acc[assigneeName] = {
        name: assigneeName,
        email: email,
        avatar: typeof task.assignee === 'object' && task.assignee?.avatar ? task.assignee.avatar : assigneeName.slice(0, 2).toUpperCase(),
        tasks: []
      };
    }
    acc[assigneeName].tasks.push(task);
    return acc;
  }, {});

  const handleSingleNotify = (task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setNotifiedTaskIds(prev => ({ ...prev, [task.id]: timeStr }));
    if (onNotifyPerson) {
      onNotifyPerson(assigneeName, task);
    }
  };

  const handleCopyMessage = (task) => {
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
    const email = getPersonEmail(assigneeName);
    const message = `🚨 *DAILY URGENT TASK REMINDER* 🚨\n👤 Assigned To: ${assigneeName} (${email})\n📁 Project: ${task.projectId} - ${task.projectName}\n📌 Task: ${task.name || task.subject}\n📅 Due Date: ${task.dueDate || 'Immediate'}\n⚡ Status: ${task.status} (Open / Working)\n\n⚠️ Reminder: Reminders will automatically STOP once this task is marked as "Completed". Please take immediate action!`;
    navigator.clipboard.writeText(message);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2500);
    if (onNotifyPerson) {
      onNotifyPerson(assigneeName, task, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in flex justify-end">
      
      {/* Background click to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full transform transition-all duration-300">
        
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
                    Urgent Task Reminders & Notifications
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-rose-600 text-white">
                    {urgentTasks.length} Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily 1x Reminder Mail & Immediate Notification Engine
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

          {/* Daily 1x Automated Reminder Engine Info Card */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Daily 1x Automated Reminder Scheduler:</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {dailyStatus.isSentToday 
                  ? `✅ Today's daily reminder batch was dispatched (${dailyStatus.todayStr}).`
                  : `⏰ Scheduled daily batch ready. Next run scheduled for today.`
                }
              </p>
            </div>

            <button
              onClick={() => onRunDailyReminders && onRunDailyReminders()}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>🚀</span>
              <span>Send Daily Reminder Run</span>
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-3.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              All Open/Working ({urgentTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('by_person')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'by_person'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              By Assignee Email ({Object.keys(tasksByAssignee).length})
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
                All Urgent Tasks Completed!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No active Open or Working urgent tasks. Daily reminder emails are automatically paused.
              </p>
            </div>
          ) : activeTab === 'all' ? (
            
            /* View 1: Flat List of all Urgent Tasks */
            <div className="space-y-3.5">
              {urgentTasks.map((task) => {
                const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned';
                const assigneeAvatar = typeof task.assignee === 'object' && task.assignee?.avatar ? task.assignee.avatar : assigneeName.slice(0, 2).toUpperCase();
                const assigneeEmail = getPersonEmail(assigneeName);
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
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {task.status}
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

                    {/* Assignee & Email Row */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-[9px] flex items-center justify-center shadow-2xs">
                          {assigneeAvatar}
                        </div>
                        <div className="leading-tight">
                          <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{assigneeName}</strong>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">{assigneeEmail}</span>
                        </div>
                      </div>

                      <div className="text-right leading-tight font-mono">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Due Date</span>
                        <strong className="text-xs font-bold text-rose-700 dark:text-rose-300">📅 {task.dueDate || 'ASAP'}</strong>
                      </div>
                    </div>

                    {/* Notification & Email Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      <div className="text-[11px] text-slate-500">
                        {wasNotified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>✅ Dispatched at {wasNotified}</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            ⚡ Daily 1x Reminder Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(task)}
                          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1"
                          title="Copy text for Slack/Teams"
                        >
                          <span>{copiedTaskId === task.id ? '✓' : '💬'}</span>
                          <span>{copiedTaskId === task.id ? 'Copied!' : 'Copy Msg'}</span>
                        </button>

                        <button
                          onClick={() => onSendEmailReminder && onSendEmailReminder(task, assigneeName)}
                          className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>📧</span>
                          <span>Send Reminder Mail</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          ) : (

            /* View 2: Grouped by Assignee Email */
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
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {person.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {person.name}
                            </h4>
                            <span className="px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                              {person.email}
                            </span>
                          </div>
                          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                            {person.tasks.length} active urgent {person.tasks.length === 1 ? 'task' : 'tasks'} (Open / Working)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSendEmailReminder && onSendEmailReminder(person.tasks[0], person.name)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>📧</span>
                        <span>Mail Digest</span>
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
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                                  {task.status}
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                                {task.name || task.subject}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Due: {task.dueDate || 'N/A'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => onSendEmailReminder && onSendEmailReminder(task, person.name)}
                                className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[11px] rounded-lg shadow-2xs hover:bg-rose-700 transition flex items-center gap-1"
                                title="Send reminder email"
                              >
                                <span>📧</span>
                                <span>{wasNotified ? 'Resend' : 'Remind'}</span>
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

        {/* Drawer Footer with Stop Rule */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
            <span>🛡️</span>
            <span>Reminders automatically stop when task is marked Completed</span>
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
