const nodemailer = require("nodemailer");
const dns = require("dns");
const net = require("net");

// Render may not have working IPv6 egress for some SMTP endpoints; prefer IPv4.
dns.setDefaultResultOrder("ipv4first");

const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_IP_FAMILY = Number(process.env.SMTP_IP_FAMILY || 4);
const SMTP_FORCE_IPV4 = process.env.SMTP_FORCE_IPV4 !== "false";
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || "";
const SMTP_PASS_RAW = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
const SMTP_PASS = String(SMTP_PASS_RAW).replace(/\s+/g, "");
const SMTP_TIMEOUT_MS = Number(
  process.env.SMTP_TIMEOUT_MS || process.env.EMAIL_TIMEOUT_MS || 10000,
);
const SMTP_CONFIGURED = Boolean(SMTP_USER && SMTP_PASS);

let transporter;

const getIpv4Socket = (options, callback) => {
  dns.lookup(options.host, { family: 4, all: false }, (lookupErr, address) => {
    if (lookupErr) {
      callback(lookupErr);
      return;
    }

    const socket = net.connect({
      host: address,
      port: options.port,
    });

    let settled = false;
    const done = (err, data) => {
      if (settled) return;
      settled = true;
      callback(err, data);
    };

    socket.once("error", (socketErr) => done(socketErr));
    socket.once("connect", () => done(null, { connection: socket }));
  });
};

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
        family: SMTP_IP_FAMILY,
        ...(SMTP_FORCE_IPV4 ? { getSocket: getIpv4Socket } : {}),
        connectionTimeout: SMTP_TIMEOUT_MS,
        greetingTimeout: SMTP_TIMEOUT_MS,
        socketTimeout: SMTP_TIMEOUT_MS,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        family: SMTP_IP_FAMILY,
        ...(SMTP_FORCE_IPV4 ? { getSocket: getIpv4Socket } : {}),
        connectionTimeout: SMTP_TIMEOUT_MS,
        greetingTimeout: SMTP_TIMEOUT_MS,
        socketTimeout: SMTP_TIMEOUT_MS,
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
    console.error("Email send failed:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });
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

const verifyMailerConnection = async () => {
  try {
    const activeTransporter = getTransporter();
    if (!activeTransporter) {
      return { ok: false, reason: "smtp-not-configured" };
    }

    await activeTransporter.verify();
    return { ok: true, reason: "smtp-verify-success" };
  } catch (error) {
    return {
      ok: false,
      reason: error.message,
      code: error.code,
      response: error.response,
    };
  }
};

module.exports = {
  sendMail,
  getMailerStatus,
  verifyMailerConnection,
};
