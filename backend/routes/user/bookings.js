const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const Service = require("../../models/Service");
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");
const { MIN_BOOKING_DAYS, getDayDiff } = require("../shared/bookingRules");
const { sendMail } = require("../../utils/mailer");
const {
  buildUserBookingReceivedTemplate,
  buildAdminBookingRequestTemplate,
} = require("../../utils/emailTemplates");

const sendBookingNotificationsInBackground = async ({
  user,
  serviceName,
  start,
  end,
  totalPrice,
  booking,
}) => {
  try {
    if (user?.email) {
      const userTemplate = buildUserBookingReceivedTemplate({
        name: user.name,
        serviceName,
        startDate: start,
        endDate: end,
        totalPrice,
        bookingId: String(booking._id),
      });

      const userMailResult = await sendMail({
        to: user.email,
        subject: "Booking Request Received - DATTA Crane Services",
        text: userTemplate.text,
        html: userTemplate.html,
      });

      if (!userMailResult.sent) {
        console.error("User booking email failed:", userMailResult.reason);
      }
    }

    const adminRecipients = await getAdminRecipients();
    if (adminRecipients.length > 0) {
      const adminTemplate = buildAdminBookingRequestTemplate({
        customerName: user?.name,
        customerEmail: user?.email,
        serviceName,
        startDate: start,
        endDate: end,
        totalPrice,
        location: `${booking.workLocation.area}, ${booking.workLocation.district}, ${booking.workLocation.state} - ${booking.workLocation.pincode}`,
        bookingId: String(booking._id),
      });

      const adminMailResult = await sendMail({
        to: adminRecipients.join(","),
        subject: "New Booking Request Received",
        text: adminTemplate.text,
        html: adminTemplate.html,
      });

      if (!adminMailResult.sent) {
        console.error("Admin booking email failed:", adminMailResult.reason);
      }
    }
  } catch (error) {
    console.error("Booking notification flow failed:", error.message);
  }
};

const getAdminRecipients = async () => {
  const recipients = new Set();

  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    recipients.add(String(process.env.ADMIN_NOTIFICATION_EMAIL).trim());
  }

  const adminUsers = await User.find({ role: "admin" }).select("email");
  adminUsers.forEach((admin) => {
    if (admin?.email) {
      recipients.add(String(admin.email).trim());
    }
  });

  return [...recipients].filter(Boolean);
};

router.get("/availability", async (req, res) => {
  try {
    const { serviceId, startDate, endDate } = req.query;

    if (!serviceId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "serviceId, startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const days = getDayDiff(start, end);
    if (days < MIN_BOOKING_DAYS) {
      return res.json({
        available: false,
        reason: `Minimum booking period is ${MIN_BOOKING_DAYS} days (6 months)`,
      });
    }

    return res.json({
      available: true,
      reason: "Service is available for selected period",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error checking availability", error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { serviceId, startDate, endDate, workLocation } = req.body;

    if (!serviceId || !startDate || !endDate || !workLocation) {
      return res.status(400).json({
        message: "serviceId, startDate, endDate and workLocation are required",
      });
    }

    const { area, district, state, pincode } = workLocation;
    if (!area || !district || !state || !pincode) {
      return res.status(400).json({
        message: "Work location must include area, district, state and pincode",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({ message: "Invalid booking date range" });
    }

    const bookingDays = getDayDiff(start, end);
    if (bookingDays < MIN_BOOKING_DAYS) {
      return res.status(400).json({
        message: `Minimum booking period is ${MIN_BOOKING_DAYS} days (6 months)`,
      });
    }

    const basePrice = bookingDays * service.pricePerDay;
    const totalPrice = basePrice;

    const newBooking = new Booking({
      userId: req.user.id,
      serviceId,
      startDate: start,
      endDate: end,
      workLocation: {
        area: String(area).trim(),
        district: String(district).trim(),
        state: String(state).trim(),
        pincode: String(pincode).trim(),
      },
      basePrice,
      totalPrice,
    });

    await newBooking.save();

    const user = await User.findById(req.user.id).select("name email");
    const serviceName = `${service.name} (${service.model})`;

    // Respond first; do notifications out-of-band so slow SMTP never blocks bookings.
    setImmediate(() => {
      sendBookingNotificationsInBackground({
        user,
        serviceName,
        start,
        end,
        totalPrice,
        booking: newBooking,
      });
    });

    return res.status(201).json({
      message: "Booking successful",
      booking: newBooking,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});

router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

module.exports = router;
