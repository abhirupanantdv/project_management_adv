import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory SMTP Configuration (can be updated via API from the UI)
let smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  fromName: 'Anantdv Project Cockpit',
  fromEmail: process.env.SMTP_FROM || 'no-reply@anantdv.com'
};

// Dispatch logs
let dispatchHistory = [];

function createTransporter(customConfig = null) {
  const cfg = customConfig || smtpConfig;
  if (cfg.auth && cfg.auth.user && cfg.auth.pass) {
    return nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure || cfg.port === 465,
      auth: {
        user: cfg.auth.user,
        pass: cfg.auth.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Fallback: Test account / sendmail preview
  return null;
}

// 1. Get Status & History
app.get('/api/mail-status', (req, res) => {
  res.json({
    configured: Boolean(smtpConfig.auth.user && smtpConfig.auth.pass),
    host: smtpConfig.host,
    port: smtpConfig.port,
    fromEmail: smtpConfig.fromEmail,
    historyCount: dispatchHistory.length,
    recentDispatches: dispatchHistory.slice(-10)
  });
});

// 2. Save SMTP Configuration
app.post('/api/config-smtp', async (req, res) => {
  const { host, port, user, pass, fromEmail, fromName, secure } = req.body;
  
  smtpConfig = {
    host: host || 'smtp.office365.com',
    port: parseInt(port || '587', 10),
    secure: Boolean(secure),
    auth: {
      user: user || '',
      pass: pass || ''
    },
    fromName: fromName || 'Anantdv Project Cockpit',
    fromEmail: fromEmail || user || 'no-reply@anantdv.com'
  };

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.verify();
      return res.json({ success: true, message: 'SMTP credentials verified successfully!' });
    }
    return res.json({ success: true, message: 'SMTP settings saved (credentials pending verification).' });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Send Single Task Reminder Email
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text, assigneeName, taskId, projectId } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ success: false, error: 'Recipient "to" and "subject" are required.' });
  }

  const logEntry = {
    id: `MAIL-${Date.now()}`,
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    to,
    assigneeName: assigneeName || to,
    subject,
    taskId,
    projectId
  };

  try {
    const transporter = createTransporter();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail || smtpConfig.auth.user}>`,
        to,
        subject,
        text: text || '',
        html: html || text || ''
      });

      logEntry.status = 'DELIVERED';
      logEntry.messageId = info.messageId;
      dispatchHistory.unshift(logEntry);

      return res.json({
        success: true,
        delivered: true,
        message: `Real email successfully delivered to ${to}!`,
        messageId: info.messageId
      });
    } else {
      // SMTP not configured yet -> Log dispatch & explain to user
      logEntry.status = 'QUEUED_READY';
      logEntry.note = 'SMTP credentials needed for direct inbox delivery, or use mailto: launcher';
      dispatchHistory.unshift(logEntry);

      return res.json({
        success: true,
        delivered: false,
        requiresSmtp: true,
        message: `Reminder generated for ${to}. To deliver straight to their inbox, enter your SMTP/Office 365 credentials or click "Open Mail App".`
      });
    }
  } catch (err) {
    logEntry.status = 'FAILED';
    logEntry.error = err.message;
    dispatchHistory.unshift(logEntry);

    return res.status(500).json({
      success: false,
      error: `Failed to deliver email to ${to}: ${err.message}`
    });
  }
});

// 4. Send Daily Batch Reminder to All Assignees
app.post('/api/daily-batch', async (req, res) => {
  const { recipients } = req.body; // Array of { name, email, tasks }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, error: 'Recipients array is required.' });
  }

  const results = [];
  const transporter = createTransporter();

  for (const r of recipients) {
    const logItem = {
      id: `BATCH-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      to: r.email,
      assigneeName: r.name,
      subject: `[DAILY DIGEST] 🚨 ${r.tasks?.length || 1} Urgent Tasks Reminder for ${r.name}`
    };

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail || smtpConfig.auth.user}>`,
          to: r.email,
          subject: logItem.subject,
          text: `Hi ${r.name},\n\nYou have ${r.tasks?.length || 1} open/working urgent tasks requiring attention today.\n\nOpen Cockpit: http://localhost:3000/`,
          html: `<p>Hi <strong>${r.name}</strong>,</p><p>You have <strong>${r.tasks?.length || 1}</strong> open/working urgent tasks requiring attention today.</p><p><a href="http://localhost:3000/">Open Project Cockpit →</a></p>`
        });
        logItem.status = 'DELIVERED';
        logItem.messageId = info.messageId;
      } catch (e) {
        logItem.status = 'FAILED';
        logItem.error = e.message;
      }
    } else {
      logItem.status = 'QUEUED_READY';
    }

    dispatchHistory.unshift(logItem);
    results.push(logItem);
  }

  res.json({
    success: true,
    total: recipients.length,
    deliveredCount: results.filter(r => r.status === 'DELIVERED').length,
    results
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mailer Server running on http://localhost:${PORT}`);
});
