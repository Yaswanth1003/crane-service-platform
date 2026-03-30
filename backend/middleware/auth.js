/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes that require authentication
 * Must be applied to routes that need user authorization
 */

const jwt = require("jsonwebtoken");

/**
 * Verify JWT token and attach user info to request object
 *
 * Expects: Authorization header with format "Bearer <token>"
 * Sets: req.user object with decoded token data (id, role, etc.)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
  // Extract Authorization header
  const token = req.header("Authorization");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove "Bearer " prefix and verify token signature
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET || "secretkey",
    );

    // Attach decoded user data to request for use in route handlers
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (err) {
    // Token verification failed (invalid, expired, or tampered)
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
