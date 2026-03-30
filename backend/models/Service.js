/**
 * Service Model
 * Represents rental services available on the platform (e.g., crane rentals)
 */

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // Service name/title (e.g., "Tower Crane", "Mobile Crane")
    name: { type: String, required: true },

    // Equipment model/variant (e.g., "TC5010", "MC80")
    model: { type: String, required: true },

    // Hourly rental rate in rupees
    pricePerHour: { type: Number, required: true },

    // Daily rental rate in rupees
    pricePerDay: { type: Number, required: true },

    // Service category (e.g., "Tower Cranes", "Mobile Cranes", "Heavy Machinery")
    category: { type: String, required: true },

    // Detailed description of the service
    description: { type: String },

    // URL to service image for display on frontend
    imageUrl: { type: String },
  },
  { timestamps: true },
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("Service", serviceSchema);
