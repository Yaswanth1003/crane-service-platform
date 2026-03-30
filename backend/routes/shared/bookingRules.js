const Booking = require("../../models/Booking");

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
  // Ensure startDate and endDate are proper Date objects with full timestamps
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  const overlapQuery = {
    serviceId,
    // Properly compare dates: existing.startDate < newEnd AND existing.endDate > newStart
    // This correctly handles different years (2026 vs 2027)
    startDate: { $lt: newEnd },
    endDate: { $gt: newStart },
    status: onlyConfirmed ? "confirmed" : { $in: ["pending", "confirmed"] },
  };

  if (excludeBookingId) {
    overlapQuery._id = { $ne: excludeBookingId };
  }

  const existing = await Booking.findOne(overlapQuery);
  return !!existing;
};

module.exports = {
  MIN_BOOKING_DAYS,
  getDayDiff,
  hasOverlap,
};
