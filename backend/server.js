/**
 * ============================================
 * CRANE SERVICE PLATFORM - BACKEND SERVER
 * ============================================
 *
 * Main entry point for the Express.js backend server
 * Handles routing, database connection, and middleware setup
 *
 * Environment Variables Required:
 * - MONGO_URI: MongoDB connection string
 * - JWT_SECRET: Secret key for JWT token generation
 * - PORT: Server port (default: 5000)
 */

require("dotenv").config(); // Load environment variables from .env file

// ===== IMPORTS =====
const express = require("express"); // Express framework for REST API
const mongoose = require("mongoose"); // MongoDB ODM for database operations
const cors = require("cors"); // Enable Cross-Origin Resource Sharing

// ===== ROUTE IMPORTS =====
const authRoutes = require("./routes/auth"); // User authentication (login, register)
const servicesRoutes = require("./routes/services"); // Service listing and details
const contactRoutes = require("./routes/contact"); // Contact form submissions
const userBookingRoutes = require("./routes/user/bookings"); // User booking management
const adminBookingRoutes = require("./routes/admin/bookings"); // Admin booking management
const adminUsersRoutes = require("./routes/admin/users"); // Admin user management
const adminServicesRoutes = require("./routes/admin/services"); // Admin service management
const adminReportsRoutes = require("./routes/admin/reports"); // Admin reports and analytics

const app = express();

// ===== MIDDLEWARE SETUP =====
// Enable CORS for cross-origin requests from frontend
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// ===== ROUTE REGISTRATION =====
// Authentication routes (register, login, token validation)
app.use("/api/auth", authRoutes);
// Public service routes (browse services)
app.use("/api/services", servicesRoutes);
// Contact form route
app.use("/api/contact", contactRoutes);
// User booking operations
app.use("/api/bookings", userBookingRoutes);
// Admin booking management
app.use("/api/admin/bookings", adminBookingRoutes);
// Admin user management
app.use("/api/admin/users", adminUsersRoutes);
// Admin service management
app.use("/api/admin/services", adminServicesRoutes);
// Admin reports and analytics
app.use("/api/admin/reports", adminReportsRoutes);

// ===== DATABASE CONNECTION =====
// Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/crane-service")
  .then(() => console.log("✓ MongoDB connected successfully"))
  .catch((err) => console.error("✗ MongoDB connection error:", err));

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
