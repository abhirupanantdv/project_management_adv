// Team Directory with verified email addresses
export const TEAM_DIRECTORY = {
  'Sushmita': { 
    name: 'Sushmita', 
    email: 'sushmita.b@anantdv.com', 
    role: 'QA Lead / Tech Lead', 
    avatar: 'SB',
    color: 'from-rose-500 to-orange-500'
  },
  'Sushmita B': { 
    name: 'Sushmita', 
    email: 'sushmita.b@anantdv.com', 
    role: 'QA Lead / Tech Lead', 
    avatar: 'SB',
    color: 'from-rose-500 to-orange-500'
  },
  'Niranjan': { 
    name: 'Niranjan Singh', 
    email: 'niranjan.ks@anantdv.com', 
    role: 'Project Manager / Architect', 
    avatar: 'NS',
    color: 'from-blue-500 to-indigo-600'
  },
  'Niranjan Singh': { 
    name: 'Niranjan Singh', 
    email: 'niranjan.ks@anantdv.com', 
    role: 'Project Manager / Architect', 
    avatar: 'NS',
    color: 'from-blue-500 to-indigo-600'
  },
  'Tanuja': { 
    name: 'Tanuja', 
    email: 'tanuja.d@anantdv.com', 
    role: 'UI/UX Designer / Product Lead', 
    avatar: 'TD',
    color: 'from-purple-500 to-pink-600'
  },
  'Tanuja D': { 
    name: 'Tanuja', 
    email: 'tanuja.d@anantdv.com', 
    role: 'UI/UX Designer / Product Lead', 
    avatar: 'TD',
    color: 'from-purple-500 to-pink-600'
  },
  'Dipanwita': { 
    name: 'Dipanwita', 
    email: 'dipanwita@anantdv.com', 
    role: 'Backend Lead', 
    avatar: 'DP',
    color: 'from-emerald-500 to-teal-600'
  },
  'Alex Chen': { 
    name: 'Alex Chen', 
    email: 'alex.c@anantdv.com', 
    role: 'DevOps Engineer', 
    avatar: 'AC',
    color: 'from-amber-500 to-yellow-600'
  }
};

const BACKEND_MAIL_URL = 'http://localhost:3001';

// Resolve email for any assignee name
export function getPersonEmail(personName) {
  if (!personName) return 'team@anantdv.com';
  const cleanName = String(personName).trim();
  
  for (const [key, val] of Object.entries(TEAM_DIRECTORY)) {
    if (cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
      return val.email;
    }
  }
  
  const normalized = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.');
  return `${normalized}@anantdv.com`;
}

// Generate formatted email subject and body for urgent task reminder
export function generateTaskReminderEmail(task, assigneeName) {
  const email = getPersonEmail(assigneeName);
  const taskName = task.name || task.subject || 'Urgent Task';
  const projectId = task.projectId || 'PROJECT';
  const projectName = task.projectName || 'Enterprise Project';
  const dueDate = task.dueDate || 'Immediate (ASAP)';
  const status = task.status || 'Open';
  const priority = task.priority || 'Urgent';

  const subject = `[URGENT REMINDER] Action Required: ${taskName} (${projectId})`;

  const textBody = `Hi ${assigneeName},

This is an automated daily reminder that you have an active URGENT task assigned to you that requires priority attention.

==================================================
TASK DETAILS:
--------------------------------------------------
Task ID:      ${task.id}
Task Name:    ${taskName}
Project:      ${projectId} - ${projectName}
Priority:     🔥 URGENT
Current Status: ${status} (Open / Working)
Due Date:     📅 ${dueDate}
Category:     ${task.category || 'Development'}
==================================================

⚠️ Reminder Notice:
Daily reminder emails will automatically STOP as soon as this task is marked as "Completed".

Please review and update the task progress in the ERPNext Project Cockpit at your earliest convenience:
http://localhost:3000/

Best regards,
Enterprise Project Cockpit System
Anantdv Technologies`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <div style="background: linear-gradient(135deg, #e11d48, #f59e0b); padding: 24px; text-align: left; color: #ffffff;">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Anantdv Enterprise Project Cockpit</div>
    <h2 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 900;">🚨 Daily Urgent Task Reminder</h2>
  </div>
  
  <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
    <p style="font-size: 15px; margin-top: 0;">Hi <strong>${assigneeName}</strong>,</p>
    <p style="font-size: 14px; color: #475569;">You have an active <strong>Urgent</strong> task assigned to you in <strong>${projectId}</strong> that is currently in <strong>${status}</strong> state.</p>
    
    <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 18px; margin: 20px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #ffe4e6; color: #be123c; padding: 2px 8px; border-radius: 4px;">${task.id}</span>
        <span style="font-size: 12px; font-weight: 800; background: #e11d48; color: #ffffff; padding: 2px 8px; border-radius: 4px;">🔥 URGENT</span>
      </div>
      <h3 style="margin: 6px 0 12px 0; font-size: 16px; color: #881337; font-weight: 800;">${taskName}</h3>
      <table style="width: 100%; font-size: 13px; color: #4c0519;">
        <tr>
          <td style="padding: 4px 0; color: #9f1239;">📁 Project:</td>
          <td style="padding: 4px 0; font-weight: 600;">${projectId} - ${projectName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #9f1239;">📅 Due Date:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #be123c;">${dueDate}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #9f1239;">⚡ Status:</td>
          <td style="padding: 4px 0; font-weight: 600;">${status}</td>
        </tr>
      </table>
    </div>

    <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #334155; margin-bottom: 20px;">
      ✅ <strong>Automatic Rule:</strong> Daily reminder emails will automatically <strong>STOP</strong> as soon as you mark this task as <strong>Completed</strong> in the Cockpit.
    </div>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="http://localhost:3000/" style="background: #e11d48; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);">
        Open Task in Project Cockpit →
      </a>
    </div>
  </div>

  <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
    Sent to <strong>${email}</strong> • Anantdv Automated Task Reminder Engine
  </div>
</div>`;

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;

  return {
    to: email,
    assigneeName,
    subject,
    textBody,
    htmlBody,
    mailtoUrl
  };
}

// Send real email via local Node backend
export async function sendEmailViaBackend(payload) {
  try {
    const res = await fetch(`${BACKEND_MAIL_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: true,
      delivered: false,
      requiresSmtp: true,
      message: `Mail server unreachable (${err.message}). Opened via native client.`
    };
  }
}

// Send daily batch via local Node backend
export async function sendDailyBatchViaBackend(recipients) {
  try {
    const res = await fetch(`${BACKEND_MAIL_URL}/api/daily-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Configure SMTP credentials in backend
export async function configureSmtpBackend(config) {
  try {
    const res = await fetch(`${BACKEND_MAIL_URL}/api/config-smtp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Get backend mail server status
export async function getBackendMailStatus() {
  try {
    const res = await fetch(`${BACKEND_MAIL_URL}/api/mail-status`);
    return await res.json();
  } catch (err) {
    return { configured: false, offline: true };
  }
}

// Local storage key for daily reminder tracking
const LAST_DAILY_REMINDER_KEY = 'erpnext_last_daily_reminder_date_v1';
const REMINDER_LOG_KEY = 'erpnext_reminder_dispatch_history_v1';

// Check if daily automated reminder was already sent today
export function getDailyReminderStatus() {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastRun = localStorage.getItem(LAST_DAILY_REMINDER_KEY);
  const isSentToday = lastRun === todayStr;
  return {
    isSentToday,
    lastRunDate: lastRun || 'Never',
    todayStr
  };
}

// Record daily reminder dispatch
export function markDailyReminderSent(todayStr = new Date().toISOString().split('T')[0]) {
  localStorage.setItem(LAST_DAILY_REMINDER_KEY, todayStr);
}

// Get dispatch log history
export function getReminderDispatchLogs() {
  const saved = localStorage.getItem(REMINDER_LOG_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Add entry to dispatch log history
export function logReminderDispatch(entry) {
  const current = getReminderDispatchLogs();
  const newEntry = {
    id: `REM-${Date.now()}`,
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    displayDate: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
    ...entry
  };
  const updated = [newEntry, ...current].slice(0, 50);
  localStorage.setItem(REMINDER_LOG_KEY, JSON.stringify(updated));
  return newEntry;
}
