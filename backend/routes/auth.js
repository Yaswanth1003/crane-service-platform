/**
 * Authentication Routes
 * Handles user registration, login, and admin setup
 *
 * Endpoints:
 * - POST /register or /signup - Register new user
 * - POST /login or /signin - Authenticate user and get JWT token
 * - POST /bootstrap-admin - Create first admin account (requires setup key)
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mailer");
const { buildUserWelcomeTemplate } = require("../utils/emailTemplates");

/**
 * Register a new user account
 *
 * Request body:
 * - name: User's full name
 * - email: User's email address (must be unique)
 * - password: Password (minimum 6 characters)
 * - contactNumber: Phone number for contact
 *
 * Validation:
 * - All fields are required
 * - Password must be at least 6 characters
 * - Email must not already exist
 *
 * Response: JWT token + user information
 */
const handleRegister = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    // Validate all required fields are provided
    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({
        message: "Name, contact number, email and password are required",
      });
    }

    // Normalize email: convert to lowercase and trim whitespace
    const normalizedEmail = email.trim().toLowerCase();

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password using bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = new User({
      name: name.trim(),
      contactNumber: String(contactNumber).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      // role defaults to "user" (see User model)
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token (expires in 1 day)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" },
    );

    // Return token and user info to frontend
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        contactNumber: newUser.contactNumber,
        email: newUser.email,
        role: newUser.role,
      },
    });

    const welcomeTemplate = buildUserWelcomeTemplate({
      name: newUser.name,
    });

    sendMail({
      to: newUser.email,
      subject: "Welcome to DATTA Crane Services",
      text: welcomeTemplate.text,
      html: welcomeTemplate.html,
    })
      .then((mailResult) => {
        if (!mailResult.sent) {
          console.error("Welcome email failed:", mailResult.reason);
        }
      })
      .catch((mailErr) => {
        console.error("Welcome email exception:", mailErr.message);
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

/**
 * Authenticate user with email and password
 *
 * Request body:
 * - email: Registered email address
 * - password: Account password
 *
 * Validation:
 * - Both email and password are required
 * - User must exist in database
 * - Password must match stored hash
 *
 * Response: JWT token + user information
 */
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Normalize email for consistent lookup
    const normalizedEmail = email.trim().toLowerCase();

    // Find user in database
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token (expires in 1 day)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" },
    );

    // Return token and user info to frontend
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        contactNumber: user.contactNumber,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

/**
 * Bootstrap Admin Account - Create first admin user
 *
 * Security: Requires a special "x-admin-setup-key" header for protection
 * This key should be set once during initial setup, then disabled
 *
 * Request header:
 * - x-admin-setup-key: Secret key from ADMIN_SETUP_KEY environment variable
 *
 * Request body:
 * - name: Admin user's full name
 * - email: Admin email address (must be unique)
 * - password: Admin password (minimum 6 characters)
 * - contactNumber: Admin contact number
 *
 * Use case: Run once during project setup to create the first admin account
 * After setup, either remove ADMIN_SETUP_KEY or disable this key in production
 */
router.post("/bootstrap-admin", async (req, res) => {
  try {
    // Get setup key from request header
    const setupKey = req.header("x-admin-setup-key");

    // Verify setup key matches environment variable
    if (
      !process.env.ADMIN_SETUP_KEY ||
      setupKey !== process.env.ADMIN_SETUP_KEY
    ) {
      return res.status(403).json({ message: "Invalid admin setup key" });
    }

    const { name, email, password, contactNumber } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !contactNumber) {
      return res.status(400).json({
        message: "Name, contact number, email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists with this email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User already exists for this email" });
    }

    // Hash password using bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Create new admin user
    const adminUser = new User({
      name: name.trim(),
      contactNumber: String(contactNumber).trim(),
      email: normalizedEmail,
      password: hash,
      role: "admin", // Set role to admin
    });

    // Save admin user to database
    await adminUser.save();

    return res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating admin user", error: error.message });
  }
});

// ===== ROUTE REGISTRATION =====
// POST /api/auth/register or /api/auth/signup - Register new user
router.post("/register", handleRegister);
router.post("/signup", handleRegister);

// POST /api/auth/login or /api/auth/signin - Login user
router.post("/login", handleLogin);
router.post("/signin", handleLogin);

module.exports = router;
