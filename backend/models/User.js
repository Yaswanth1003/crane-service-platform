/**
 * User Model
 * Stores user account information and authentication details
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: { type: String, required: true },

    // Contact number for communication (trimmed to remove whitespace)
    contactNumber: { type: String, required: true, trim: true },

    // Email address (unique identifier, must be unique across all users)
    email: { type: String, required: true, unique: true },

    // Hashed password (never store plain text passwords)
    password: { type: String, required: true },

    // User role: "user" for customers, "admin" for administrators
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
