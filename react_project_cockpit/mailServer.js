import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Hostinger Email SMTP Configuration (Default preset)
let smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false', // true for 465 SSL, false for 587
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  fromName: 'Anantdv Project Cockpit',
  fromEmail: process.env.SMTP_FROM || ''
};

// Dispatch logs
let dispatchHistory = [];

function createTransporter(customConfig = null) {
  const cfg = customConfig || smtpConfig;
  if (cfg.auth && cfg.auth.user && cfg.auth.pass) {
    return nodemailer.createTransport({
      host: cfg.host || 'smtp.hostinger.com',
      port: cfg.port || 465,
      secure: cfg.port === 465 || cfg.secure,
      auth: {
        user: cfg.auth.user,
        pass: cfg.auth.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
}

// 1. Get Status & History
app.get('/api/mail-status', (req, res) => {
  res.json({
    configured: Boolean(smtpConfig.auth.user && smtpConfig.auth.pass),
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    fromEmail: smtpConfig.fromEmail || smtpConfig.auth.user,
    historyCount: dispatchHistory.length,
    recentDispatches: dispatchHistory.slice(-10)
  });
});

// 2. Save Hostinger / Custom SMTP Configuration
app.post('/api/config-smtp', async (req, res) => {
  const { host, port, user, pass, fromEmail, fromName, secure } = req.body;
  
  const parsedPort = parseInt(port || '465', 10);
  const isSecure = parsedPort === 465 || secure === true;

  smtpConfig = {
    host: host || 'smtp.hostinger.com',
    port: parsedPort,
    secure: isSecure,
    auth: {
      user: user || '',
      pass: pass || ''
    },
    fromName: fromName || 'Anantdv Project Cockpit',
    fromEmail: fromEmail || user || ''
  };

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.verify();
      return res.json({ success: true, message: 'Hostinger SMTP connection verified and authenticated successfully!' });
    }
    return res.json({ success: true, message: 'Hostinger SMTP settings updated.' });
  } catch (err) {
    return res.status(400).json({ success: false, error: `Hostinger SMTP Error: ${err.message}` });
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
      const senderAddress = smtpConfig.fromEmail || smtpConfig.auth.user;
      const info = await transporter.sendMail({
        from: `"${smtpConfig.fromName}" <${senderAddress}>`,
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
        message: `Real email successfully delivered to ${to} via Hostinger SMTP (${smtpConfig.host})!`,
        messageId: info.messageId
      });
    } else {
      logEntry.status = 'AWAITING_CREDENTIALS';
      dispatchHistory.unshift(logEntry);

      return res.json({
        success: true,
        delivered: false,
        requiresSmtp: true,
        hostingerWebmail: 'https://mail.hostinger.com/',
        message: `Hostinger SMTP credentials needed. Open https://mail.hostinger.com/ or enter your email password in SMTP Settings.`
      });
    }
  } catch (err) {
    logEntry.status = 'FAILED';
    logEntry.error = err.message;
    dispatchHistory.unshift(logEntry);

    return res.status(500).json({
      success: false,
      error: `Hostinger SMTP delivery failed: ${err.message}`
    });
  }
});

// 4. Send Daily Batch Reminder
app.post('/api/daily-batch', async (req, res) => {
  const { recipients } = req.body;

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
        const senderAddress = smtpConfig.fromEmail || smtpConfig.auth.user;
        const info = await transporter.sendMail({
          from: `"${smtpConfig.fromName}" <${senderAddress}>`,
          to: r.email,
          subject: logItem.subject,
          text: `Hi ${r.name},\n\nYou have ${r.tasks?.length || 1} active urgent tasks in Open/Working status.\n\nOpen Cockpit: http://localhost:3000/`,
          html: `<p>Hi <strong>${r.name}</strong>,</p><p>You have <strong>${r.tasks?.length || 1}</strong> active urgent tasks in Open/Working status requiring attention today.</p><p><a href="http://localhost:3000/">Open Project Cockpit →</a></p>`
        });
        logItem.status = 'DELIVERED';
        logItem.messageId = info.messageId;
      } catch (e) {
        logItem.status = 'FAILED';
        logItem.error = e.message;
      }
    } else {
      logItem.status = 'AWAITING_CREDENTIALS';
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
  console.log(`🚀 Hostinger Mailer Server running on http://localhost:${PORT}`);
});
