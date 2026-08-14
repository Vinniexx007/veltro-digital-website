const nodemailer = require('nodemailer');

function clean(value, max = 3000) {
  return String(value || '').trim().slice(0, max);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = req.body || {};
  const lead = {
    id: `VD-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    name: clean(body.name, 120),
    businessType: clean(body.businessType, 160),
    phone: clean(body.phone, 80),
    email: clean(body.email, 200),
    service: clean(body.service, 160),
    message: clean(body.message, 3000),
  };

  if (!lead.name || !lead.businessType || !lead.phone || !validateEmail(lead.email) || !lead.service) {
    return res.status(400).json({ error: 'Please complete all required fields with a valid email address.' });
  }

  const smtpReady = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.OWNER_EMAIL
  );

  if (!smtpReady) {
    return res.status(503).json({
      error: 'Email delivery is not configured yet. Please contact Veltro Digital by email or phone.',
    });
  }

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const ownerText = [
      'New Veltro Digital enquiry',
      '',
      `ID: ${lead.id}`,
      `Name: ${lead.name}`,
      `Business type: ${lead.businessType}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Service: ${lead.service}`,
      `Message: ${lead.message || '-'}`,
      `Received: ${lead.receivedAt}`,
    ].join('\n');

    await transport.sendMail({
      from,
      to: process.env.OWNER_EMAIL,
      replyTo: lead.email,
      subject: `New Veltro Digital enquiry — ${lead.name}`,
      text: ownerText,
    });

    await transport.sendMail({
      from,
      to: lead.email,
      subject: 'We’ve received your Veltro Digital enquiry',
      text: `Hi ${lead.name},\n\nThanks for getting in touch with Veltro Digital. We’ve received your enquiry about “${lead.service}”. We’ll respond within 24 hours.\n\nYour reference is ${lead.id}.\n\nVeltro Digital`,
    });

    return res.status(200).json({ ok: true, id: lead.id, emailSent: true });
  } catch (error) {
    console.error('Contact form email error:', error);
    return res.status(500).json({ error: 'We could not send your message right now. Please try again or use the alternative contact details.' });
  }
};
