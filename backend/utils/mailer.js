const nodemailer = require("nodemailer");

const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || "";
const SMTP_PASS_RAW = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
const SMTP_PASS = String(SMTP_PASS_RAW).replace(/\s+/g, "");
const SMTP_CONFIGURED = Boolean(SMTP_USER && SMTP_PASS);

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!SMTP_CONFIGURED) {
    console.warn("SMTP not configured. Email notifications are disabled.");
    return null;
  }

  // Prefer explicit SMTP host config; fallback to Gmail service for EMAIL_USER/PASS setups.
  transporter = SMTP_HOST
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

  return transporter;
};

const getFromAddress = () => {
  const fromEmail = process.env.SMTP_FROM_EMAIL || SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "DATTA Crane Services";
  return fromEmail ? `"${fromName}" <${fromEmail}>` : undefined;
};

const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!to || !subject || (!text && !html)) {
      return { sent: false, reason: "invalid-payload" };
    }

    const activeTransporter = getTransporter();
    if (!activeTransporter) {
      return { sent: false, reason: "smtp-not-configured" };
    }

    await activeTransporter.sendMail({
      from: getFromAddress(),
      to,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    console.error("Email send failed:", error.message);
    return { sent: false, reason: error.message };
  }
};

const getMailerStatus = () => {
  if (!SMTP_USER) {
    return {
      ok: false,
      reason: "SMTP user is missing",
    };
  }

  if (!SMTP_PASS) {
    return {
      ok: false,
      reason: "SMTP password/app password is missing",
    };
  }

  return {
    ok: true,
    reason: SMTP_HOST
      ? `SMTP ready (${SMTP_HOST}:${SMTP_PORT})`
      : "SMTP ready (gmail service mode)",
  };
};

module.exports = {
  sendMail,
  getMailerStatus,
};
