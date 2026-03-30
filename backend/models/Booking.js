/**
 * Booking Model
 * Represents service bookings/reservations made by users
 * Tracks pricing, location, status, and payment information
 */

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Reference to the user who made this booking
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the service being booked
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // Service rental start date and time
    startDate: { type: Date, required: true },

    // Service rental end date and time
    endDate: { type: Date, required: true },

    // Work location details
    workLocation: {
      // Area/locality name (e.g., "Whitefield", "Koramangala")
      area: { type: String, required: true, trim: true },

      // District name (e.g., "Bangalore", "Hyderabad")
      district: { type: String, required: true, trim: true },

      // State/Province name (e.g., "Karnataka", "Telangana")
      state: { type: String, required: true, trim: true },

      // Postal code for the work location
      pincode: { type: String, required: true, trim: true },
    },

    // Base rental price before taxes
    basePrice: { type: Number, required: true },

    // GST (Goods and Services Tax) percentage applied
    gstPercentage: { type: Number, default: 0 },

    // Calculated GST amount in rupees
    gstAmount: { type: Number, required: true },

    // Final total price (basePrice + gstAmount)
    totalPrice: { type: Number, required: true },

    // Booking status:
    // - "pending": Awaiting admin confirmation
    // - "confirmed": Admin approved the booking
    // - "rejected": Admin rejected the booking
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },

    // Payment status:
    // - "unpaid": Payment not received
    // - "paid": Payment successfully received
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Booking", bookingSchema);
