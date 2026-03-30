const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("userId", "name email role contactNumber")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching all bookings", error: error.message });
  }
});

router.patch(
  "/:bookingId/status",
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

      // Status updates are persisted directly with no outbound email dependency.
      booking.status = status;
      await booking.save();

      return res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating booking status",
        error: error.message,
      });
    }
  },
);

module.exports = router;
