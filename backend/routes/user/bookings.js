const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const Service = require("../../models/Service");
const authMiddleware = require("../../middleware/auth");
const {
  MIN_BOOKING_DAYS,
  getDayDiff,
  hasOverlap,
} = require("../shared/bookingRules");
const { sendAdminNewBookingEmail } = require("../../utils/mailer");

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

    const overlap = await hasOverlap({
      serviceId,
      startDate: start,
      endDate: end,
    });

    if (overlap) {
      return res.json({
        available: false,
        reason: "Selected date range overlaps with an existing booking",
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

    const overlap = await hasOverlap({
      serviceId,
      startDate: start,
      endDate: end,
    });
    if (overlap) {
      return res
        .status(409)
        .json({ message: "Service is not available for selected dates" });
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

    const bookingWithDetails = await Booking.findById(newBooking._id)
      .populate("serviceId")
      .populate("userId", "name email contactNumber");

    if (bookingWithDetails?.userId && bookingWithDetails?.serviceId) {
      Promise.resolve(
        sendAdminNewBookingEmail({
          userName: bookingWithDetails.userId.name,
          userEmail: bookingWithDetails.userId.email,
          contactNumber: bookingWithDetails.userId.contactNumber,
          serviceName: bookingWithDetails.serviceId.name,
          serviceModel: bookingWithDetails.serviceId.model,
          startDate: bookingWithDetails.startDate,
          endDate: bookingWithDetails.endDate,
          workLocation: bookingWithDetails.workLocation,
          basePrice: bookingWithDetails.basePrice,
          totalPrice: bookingWithDetails.totalPrice,
        }),
      ).catch((mailError) => {
        console.error("Booking email notification failed:", mailError.message);
      });
    }

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
