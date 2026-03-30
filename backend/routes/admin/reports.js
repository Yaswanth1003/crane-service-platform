const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/summary", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totals, monthly] = await Promise.all([
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            confirmedBookings: {
              $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
            },
            pendingBookings: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            rejectedBookings: {
              $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
            },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "confirmed"] }, "$totalPrice", 0],
              },
            },
          },
        },
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            bookings: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "confirmed"] }, "$totalPrice", 0],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    return res.json({
      totals: totals[0] || {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        rejectedBookings: 0,
        totalRevenue: 0,
      },
      monthly,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
});

module.exports = router;
