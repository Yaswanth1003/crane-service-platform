/**
 * Email Utility Module
 * Handles all email sending operations for the application
 *
 * Features:
 * - Flexible SMTP configuration (Gmail, custom SMTP, etc.)
 * - Graceful fallback when email is not configured
 * - HTML and text email templates
 * - Multiple email types: welcome, booking confirmation, booking status, contact form
 */

const nodemailer = require("nodemailer");

// Default admin email for receiving notifications (can be overridden via env var)
const DEFAULT_TO_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "duttacraneservices@gmail.com";
const MAIL_DEBUG_TO = (process.env.MAIL_DEBUG_TO || "").trim();

const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS || 10000);
const EMAIL_RETRY_COUNT = Number(process.env.EMAIL_RETRY_COUNT || 2);
const EMAIL_RETRY_DELAY_MS = Number(process.env.EMAIL_RETRY_DELAY_MS || 1000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create email transporter based on environment configuration
 *
 * Supports two configuration methods:
 * 1. SMTP with custom host/port
 * 2. Service-based (Gmail, etc.)
 *
 * Environment variables:
 * - SMTP_HOST: Custom SMTP server host (optional)
 * - SMTP_PORT: Custom SMTP port (default: 587)
 * - SMTP_SERVICE: Email service name (e.g., "gmail")
 * - SMTP_USER or EMAIL_USER: SMTP authentication username
 * - SMTP_PASS or EMAIL_PASS: SMTP authentication password
 *
 * @returns {Object|null} Nodemailer transporter object, or null if not configured
 */
const createTransporter = ({ host, service, port, user, pass }) => {
  const commonOptions = {
    auth: { user, pass },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  };

  if (!host) {
    return nodemailer.createTransport({
      service: service || "gmail",
      ...commonOptions,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...commonOptions,
  });
};

const createTransportCandidates = () => {
  const candidates = [];

  const primaryUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const primaryPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const primaryHost = process.env.SMTP_HOST;
  const primaryService = process.env.SMTP_SERVICE;
  const primaryPort = Number(process.env.SMTP_PORT || 587);
  if (primaryUser && primaryPass) {
    candidates.push({
      label: "primary",
      from: primaryUser,
      transporter: createTransporter({
        host: primaryHost,
        service: primaryService,
        port: primaryPort,
        user: primaryUser,
        pass: primaryPass,
      }),
    });

    // For Gmail credentials, also try explicit SMTP host as a fallback.
    if (!primaryHost) {
      candidates.push({
        label: "primary-gmail-host",
        from: primaryUser,
        transporter: createTransporter({
          host: "smtp.gmail.com",
          service: undefined,
          port: 465,
          user: primaryUser,
          pass: primaryPass,
        }),
      });
    }
  }

  const fallbackUser = process.env.SMTP_FALLBACK_USER;
  const fallbackPass = process.env.SMTP_FALLBACK_PASS;
  const fallbackHost = process.env.SMTP_FALLBACK_HOST;
  const fallbackService = process.env.SMTP_FALLBACK_SERVICE;
  const fallbackPort = Number(process.env.SMTP_FALLBACK_PORT || 587);
  if (fallbackUser && fallbackPass) {
    candidates.push({
      label: "fallback",
      from: fallbackUser,
      transporter: createTransporter({
        host: fallbackHost,
        service: fallbackService,
        port: fallbackPort,
        user: fallbackUser,
        pass: fallbackPass,
      }),
    });

    if (!fallbackHost) {
      candidates.push({
        label: "fallback-gmail-host",
        from: fallbackUser,
        transporter: createTransporter({
          host: "smtp.gmail.com",
          service: undefined,
          port: 465,
          user: fallbackUser,
          pass: fallbackPass,
        }),
      });
    }
  }

  return candidates;
};

const sendWithRetries = async ({ transporter, payload, label }) => {
  let lastError = null;

  for (let attempt = 1; attempt <= EMAIL_RETRY_COUNT + 1; attempt += 1) {
    try {
      await transporter.sendMail(payload);
      return { ok: true, attempt, label };
    } catch (error) {
      lastError = error;
      if (attempt <= EMAIL_RETRY_COUNT) {
        await sleep(EMAIL_RETRY_DELAY_MS * attempt);
      }
    }
  }

  return { ok: false, error: lastError, label };
};

/**
 * Send email with fallback for unconfigured SMTP
 *
 * If SMTP is not configured, logs warning and skips email
 * This prevents application crashes when email service is unavailable
 *
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text email body
 * @param {string} params.html - HTML email body
 * @returns {Promise<Object>} Result object with {skipped: boolean}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const targetEmail = MAIL_DEBUG_TO || to;
  const candidates = createTransportCandidates();

  if (candidates.length === 0) {
    console.warn(
      `Email skipped (SMTP not configured). Configure SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS. Subject: ${subject}`,
    );
    return { skipped: true };
  }

  let lastError = null;

  for (const candidate of candidates) {
    const from = process.env.SMTP_FROM || candidate.from;
    const result = await sendWithRetries({
      transporter: candidate.transporter,
      label: candidate.label,
      payload: { from, to: targetEmail, subject, text, html },
    });

    if (result.ok) {
      console.log(
        `Email delivered to ${targetEmail} via ${result.label} (attempt ${result.attempt}) - ${subject}`,
      );
      return {
        skipped: false,
        provider: result.label,
        attempt: result.attempt,
        to: targetEmail,
      };
    }

    lastError = result.error;
    console.error(
      `Email send failed to ${targetEmail} via ${result.label} provider for '${subject}': ${result.error?.message}`,
    );
  }

  return { skipped: true, error: lastError?.message || "Unknown mail error" };
};

/**
 * Send welcome email to new user after registration
 *
 * @param {Object} params - User information
 * @param {string} params.name - User's full name
 * @param {string} params.email - User's email address
 * @param {string} params.contactNumber - User's contact number
 * @returns {Promise<Object>} Email send result
 */
const sendWelcomeEmail = async ({ name, email, contactNumber }) => {
  const subject = "Welcome to Datta Cranes";
  const text = `Hi ${name},\n\nYour account has been created successfully.\nContact Number: ${contactNumber}\n\nThank you for registering with Datta Cranes.`;

  return sendEmail({
    to: email,
    subject,
    text,
    html: `<p>Hi <strong>${name}</strong>,</p><p>Your account has been created successfully.</p><p><strong>Contact Number:</strong> ${contactNumber}</p><p>Thank you for registering with Datta Cranes.</p>`,
  });
};

/**
 * Send booking notification email to admin
 *
 * Called when user creates a new booking
 * Informs admin about new booking request for review
 *
 * @param {Object} params - Booking details
 * @param {string} params.userName - Customer name
 * @param {string} params.userEmail - Customer email
 * @param {string} params.contactNumber - Customer contact
 * @param {string} params.serviceName - Service/crane name
 * @param {string} params.serviceModel - Equipment model
 * @param {Date} params.startDate - Rental start date
 * @param {Date} params.endDate - Rental end date
 * @param {Object} params.workLocation - Work location details
 * @param {number} params.basePrice - Base rental price
 * @param {number} params.totalPrice - Total price with taxes
 * @returns {Promise<Object>} Email send result
 */
const sendAdminNewBookingEmail = async ({
  userName,
  userEmail,
  contactNumber,
  serviceName,
  serviceModel,
  startDate,
  endDate,
  workLocation,
  basePrice,
  totalPrice,
}) => {
  const subject = "New Crane Booking Request";
  const locationText = `${workLocation.area}, ${workLocation.district}, ${workLocation.state} - ${workLocation.pincode}`;

  const text = `A new booking request has been created.\n\nUser: ${userName}\nEmail: ${userEmail}\nContact: ${contactNumber}\nCrane: ${serviceName} - ${serviceModel}\nPeriod: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}\nWork Location: ${locationText}\nTotal Price: INR ${totalPrice}`;

  return sendEmail({
    to: DEFAULT_TO_EMAIL,
    subject,
    text,
    html: `<p>A new booking request has been created.</p><ul><li><strong>User:</strong> ${userName}</li><li><strong>Email:</strong> ${userEmail}</li><li><strong>Contact:</strong> ${contactNumber}</li><li><strong>Crane:</strong> ${serviceName} - ${serviceModel}</li><li><strong>Period:</strong> ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}</li><li><strong>Work Location:</strong> ${locationText}</li><li><strong>Total Price:</strong> INR ${Number(totalPrice).toLocaleString()}</li></ul>`,
  });
};

/**
 * Send booking status update email to user
 *
 * Called when admin confirms or rejects a booking
 * Informs user about the decision on their booking request
 *
 * @param {Object} params - Booking status information
 * @param {string} params.name - User's name
 * @param {string} params.email - User's email
 * @param {string} params.status - Booking status ("confirmed" or "rejected")
 * @param {string} params.serviceName - Service name
 * @returns {Promise<Object>} Email send result
 */
const sendUserBookingStatusEmail = async ({
  name,
  email,
  status,
  serviceName,
}) => {
  const subject = `Your booking has been ${status}`;
  const text = `Hi ${name},\n\nYour booking for ${serviceName} has been ${status}.\n\nThank you,\nDatta Cranes`;

  return sendEmail({
    to: email,
    subject,
    text,
    html: `<p>Hi <strong>${name}</strong>,</p><p>Your booking for <strong>${serviceName}</strong> has been <strong>${status}</strong>.</p><p>Thank you,<br/>Datta Cranes</p>`,
  });
};

/**
 * Send contact form submission email to admin
 *
 * Called when user submits the contact form
 * Informs admin about new inquiry for follow-up
 *
 * @param {Object} params - Contact form data
 * @param {string} params.name - Sender's name
 * @param {string} params.email - Sender's email
 * @param {string} params.message - Message content
 * @param {string} params.phone - Sender's phone number (optional)
 * @returns {Promise<Object>} Email send result
 */
const sendContactFormEmail = async ({ name, email, message, phone }) => {
  const subject = `Contact Inquiry from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\nMessage:\n${message}`;

  return sendEmail({
    to: DEFAULT_TO_EMAIL,
    subject,
    text,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || "-"}</p><p><strong>Message:</strong><br/>${message}</p>`,
  });
};

// ===== EXPORT FUNCTIONS =====
module.exports = {
  sendWelcomeEmail,
  sendAdminNewBookingEmail,
  sendUserBookingStatusEmail,
  sendContactFormEmail,
};
