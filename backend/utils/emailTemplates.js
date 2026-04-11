const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(value || "N/A");
  }
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return `INR ${value.toLocaleString("en-IN")}`;
};

const getLogoHtml = () => {
  const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
  if (!clientUrl) {
    return "";
  }
  return `<img src="${clientUrl}/company_logo.png" alt="DATTA Cranes" width="56" height="56" style="display:block;border-radius:50%;border:2px solid #ffffff22;" />`;
};

const userShell = ({
  preheader,
  title,
  subtitle,
  bodyHtml,
  ctaText,
  ctaUrl,
}) => {
  const logoHtml = getLogoHtml();
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,'Segoe UI',sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:linear-gradient(180deg,#f3f6fb 0%,#eef3ff 100%);padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.12);">
            <tr>
              <td style="padding:0;background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 55%,#2563eb 100%);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:24px 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="64" valign="top">${logoHtml}</td>
                          <td valign="top" style="color:#ffffff;padding-left:12px;">
                            <div style="font-size:12px;letter-spacing:1.2px;font-weight:700;opacity:0.86;">DATTA CRANE SERVICES</div>
                            <div style="font-size:28px;line-height:1.2;font-weight:800;margin-top:8px;">${title}</div>
                            <div style="font-size:14px;line-height:1.6;opacity:0.9;margin-top:8px;">${subtitle}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${bodyHtml}
                ${
                  ctaText && ctaUrl
                    ? `<div style="margin-top:24px;"><a href="${ctaUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px;">${ctaText}</a></div>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;">
                This is an automated message from DATTA Crane Services. For support, contact our team.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildFactRows = (facts) =>
  facts
    .map(
      (fact) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:13px;font-weight:600;width:38%;">${fact.label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:13px;">${fact.value}</td>
      </tr>`,
    )
    .join("");

const buildUserWelcomeTemplate = ({ name }) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">Hi <strong>${name || "Customer"}</strong>,</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">Your account has been created successfully. You can now browse crane services, submit bookings, and track updates in real time.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      ${buildFactRows([
        { label: "Account Status", value: "Active" },
        { label: "Portal", value: "DATTA Crane Services" },
        { label: "Next Step", value: "Sign in and book your first crane" },
      ])}
    </table>
  `;

  return {
    html: userShell({
      preheader: "Welcome to DATTA Crane Services. Your account is ready.",
      title: "Welcome Aboard",
      subtitle:
        "Your account is ready for professional crane booking services.",
      bodyHtml,
      ctaText: "Open Dashboard",
      ctaUrl: `${clientUrl}/dashboard`,
    }),
    text: [
      `Hi ${name || "Customer"},`,
      "",
      "Your account has been created successfully.",
      "You can now sign in and book crane services.",
    ].join("\n"),
  };
};

const buildUserBookingReceivedTemplate = ({
  name,
  serviceName,
  startDate,
  endDate,
  totalPrice,
  bookingId,
}) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">Hi <strong>${name || "Customer"}</strong>,</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">We have received your booking request and it is now under admin review.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      ${buildFactRows([
        { label: "Booking ID", value: bookingId || "N/A" },
        { label: "Service", value: serviceName || "N/A" },
        { label: "Start", value: formatDate(startDate) },
        { label: "End", value: formatDate(endDate) },
        { label: "Amount", value: formatCurrency(totalPrice) },
        { label: "Status", value: "Pending Approval" },
      ])}
    </table>
  `;

  return {
    html: userShell({
      preheader:
        "Your booking request has been received and is pending review.",
      title: "Booking Request Received",
      subtitle:
        "Our operations team is reviewing your request and will update you shortly.",
      bodyHtml,
      ctaText: "Track Booking",
      ctaUrl: `${clientUrl}/dashboard`,
    }),
    text: [
      `Hi ${name || "Customer"},`,
      "",
      "We received your booking request.",
      `Service: ${serviceName || "N/A"}`,
      `Start: ${formatDate(startDate)}`,
      `End: ${formatDate(endDate)}`,
      `Amount: ${formatCurrency(totalPrice)}`,
      "Status: Pending Approval",
    ].join("\n"),
  };
};

const buildUserBookingStatusTemplate = ({
  name,
  serviceName,
  startDate,
  endDate,
  totalPrice,
  status,
}) => {
  const normalizedStatus = status === "confirmed" ? "Confirmed" : "Rejected";
  const accent = status === "confirmed" ? "#16a34a" : "#dc2626";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">Hi <strong>${name || "Customer"}</strong>,</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.75;">Your booking request has been reviewed by our admin team.</p>
    <div style="display:inline-block;margin:6px 0 16px;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:700;color:#ffffff;background:${accent};">Status: ${normalizedStatus}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      ${buildFactRows([
        { label: "Service", value: serviceName || "N/A" },
        { label: "Start", value: formatDate(startDate) },
        { label: "End", value: formatDate(endDate) },
        { label: "Amount", value: formatCurrency(totalPrice) },
      ])}
    </table>
  `;

  return {
    html: userShell({
      preheader: `Your booking status is now ${normalizedStatus}.`,
      title: `Booking ${normalizedStatus}`,
      subtitle:
        status === "confirmed"
          ? "Your service slot is now confirmed by our operations team."
          : "This booking request was not approved. Please submit a new request if needed.",
      bodyHtml,
      ctaText: "View Bookings",
      ctaUrl: `${clientUrl}/dashboard`,
    }),
    text: [
      `Hi ${name || "Customer"},`,
      "",
      `Your booking is ${normalizedStatus}.`,
      `Service: ${serviceName || "N/A"}`,
      `Start: ${formatDate(startDate)}`,
      `End: ${formatDate(endDate)}`,
      `Amount: ${formatCurrency(totalPrice)}`,
    ].join("\n"),
  };
};

const buildAdminBookingRequestTemplate = ({
  customerName,
  customerEmail,
  serviceName,
  startDate,
  endDate,
  totalPrice,
  location,
  bookingId,
}) => {
  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:18px;background:#f8fafc;font-family:Arial,'Segoe UI',sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
      <tr><td style="padding:14px 16px;background:#0f172a;color:#ffffff;font-size:14px;font-weight:700;">New Booking Request</td></tr>
      <tr>
        <td style="padding:14px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${buildFactRows([
              { label: "Booking ID", value: bookingId || "N/A" },
              { label: "Customer", value: customerName || "N/A" },
              { label: "Customer Email", value: customerEmail || "N/A" },
              { label: "Service", value: serviceName || "N/A" },
              { label: "Start", value: formatDate(startDate) },
              { label: "End", value: formatDate(endDate) },
              { label: "Amount", value: formatCurrency(totalPrice) },
              { label: "Location", value: location || "N/A" },
            ])}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "New Booking Request",
    "",
    `Booking ID: ${bookingId || "N/A"}`,
    `Customer: ${customerName || "N/A"}`,
    `Customer Email: ${customerEmail || "N/A"}`,
    `Service: ${serviceName || "N/A"}`,
    `Start: ${formatDate(startDate)}`,
    `End: ${formatDate(endDate)}`,
    `Amount: ${formatCurrency(totalPrice)}`,
    `Location: ${location || "N/A"}`,
  ].join("\n");

  return { html, text };
};

module.exports = {
  buildUserWelcomeTemplate,
  buildUserBookingReceivedTemplate,
  buildUserBookingStatusTemplate,
  buildAdminBookingRequestTemplate,
};
