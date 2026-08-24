import React, { useState } from 'react';
import { generateTaskReminderEmail, sendEmailViaBackend } from '../../services/reminderEmailService.js';

export default function EmailReminderModal({
  isOpen,
  onClose,
  task,
  assigneeName,
  onSendSuccess,
  onOpenSmtpConfig
}) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'text'
  const [isSending, setIsSending] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !task) return null;

  const targetAssignee = assigneeName || (typeof task.assignee === 'object' ? task.assignee?.name : task.assignee || 'Unassigned');
  const emailData = generateTaskReminderEmail(task, targetAssignee);

  const handleSendEmail = async () => {
    setIsSending(true);
    setResultMsg(null);

    const res = await sendEmailViaBackend({
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.htmlBody,
      text: emailData.textBody,
      assigneeName: targetAssignee,
      taskId: task.id,
      projectId: task.projectId
    });

    setIsSending(false);

    if (res.delivered) {
      setResultMsg({
        type: 'success',
        text: `✅ Real email successfully delivered to ${emailData.to}!`
      });
      if (onSendSuccess) {
        onSendSuccess(targetAssignee, emailData.to, task);
      }
      setTimeout(() => {
        onClose();
      }, 2200);
    } else {
      setResultMsg({
        type: 'info',
        text: `📬 Email dispatched to local mailer queue. Click "Open Mail App" below to send via Outlook/Gmail immediately, or configure SMTP credentials.`
      });
      if (onSendSuccess) {
        onSendSuccess(targetAssignee, emailData.to, task);
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(emailData.textBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/30">
              📧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Send Urgent Reminder Email
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-rose-600 text-white animate-pulse">
                  Daily Reminder
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated reminder dispatches to the assigned person
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

        {/* Recipient & Metadata Strip */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 dark:text-slate-400">To:</span>
              <span className="font-bold text-slate-900 dark:text-white">{targetAssignee}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold border border-indigo-200 dark:border-indigo-800">
                {emailData.to}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md transition ${viewMode === 'preview' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-500'}`}
              >
                HTML Preview
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1 rounded-md transition ${viewMode === 'text' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-500'}`}
              >
                Plain Text
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-bold">Subject:</span>
            <span className="font-semibold truncate">{emailData.subject}</span>
          </div>
        </div>

        {/* Automatic Stop Condition Rule Callout */}
        <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span><strong>Automated Stop Rule:</strong> Daily reminder emails will automatically <strong>STOP</strong> when task is marked <strong>Completed</strong>.</span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded">Active</span>
        </div>

        {/* Result Message if any */}
        {resultMsg && (
          <div className={`mx-6 mt-3 p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
            resultMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' :
            'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            <span>{resultMsg.text}</span>
            {onOpenSmtpConfig && (
              <button
                onClick={onOpenSmtpConfig}
                className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-bold hover:bg-amber-700"
              >
                SMTP Settings ⚙️
              </button>
            )}
          </div>
        )}

        {/* Modal Body / Email Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {viewMode === 'preview' ? (
            <div
              className="border border-slate-200 dark:border-slate-700 rounded-2xl p-2 bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner"
              dangerouslySetInnerHTML={{ __html: emailData.htmlBody }}
            />
          ) : (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {emailData.textBody}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Body'}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Native mailto launcher - Launches Outlook / Windows Mail directly */}
            <a
              href={emailData.mailtoUrl}
              className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              title="Launch Outlook or default mail client"
            >
              <span>📬</span>
              <span>Open Mail App</span>
            </a>

            {/* Direct dispatch */}
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSending ? '⏳' : '⚡'}</span>
              <span>{isSending ? 'Dispatching...' : 'Dispatch Reminder Email'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
