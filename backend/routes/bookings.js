const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const MIN_BOOKING_DAYS = 180;

const getDayDiff = (startDate, endDate) => {
  const ms = endDate.getTime() - startDate.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const hasOverlap = async ({
  serviceId,
  startDate,
  endDate,
  excludeBookingId,
  onlyConfirmed = false,
}) => {
  const overlapQuery = {
    serviceId,
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
    status: onlyConfirmed ? "confirmed" : { $in: ["pending", "confirmed"] },
  };

  if (excludeBookingId) {
    overlapQuery._id = { $ne: excludeBookingId };
  }

  const existing = await Booking.findOne(overlapQuery);
  return !!existing;
};

// Check availability for a service within a date range
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

// Create a booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { serviceId, startDate, endDate, totalPrice } = req.body;

    if (!serviceId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "serviceId, startDate and endDate are required" });
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
      return res
        .status(400)
        .json({
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

    const calculatedPrice = bookingDays * service.pricePerDay;
    const newBooking = new Booking({
      userId: req.user.id,
      serviceId,
      startDate: start,
      endDate: end,
      totalPrice: totalPrice || calculatedPrice,
    });
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});

// Get user bookings
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("serviceId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

// Admin: get all bookings
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching all bookings", error: error.message });
  }
});

// Admin: update booking status (accept/reject)
router.patch(
  "/admin/:bookingId/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!["confirmed", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be confirmed or rejected" });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (status === "confirmed") {
        const overlap = await hasOverlap({
          serviceId: booking.serviceId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          excludeBookingId: booking._id,
          onlyConfirmed: true,
        });

        if (overlap) {
          return res
            .status(409)
            .json({
              message:
                "Cannot confirm due to overlap with existing confirmed booking",
            });
        }
      }

      booking.status = status;
      await booking.save();

      return res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error updating booking status",
          error: error.message,
        });
    }
  },
);

module.exports = router;
