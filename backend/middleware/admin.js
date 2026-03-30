/**
 * Admin Authorization Middleware
 * Checks if the authenticated user has admin role
 * Must be applied AFTER authMiddleware to protect admin-only routes
 */

/**
 * Verify user has admin role
 *
 * Requires: authMiddleware to be applied first (req.user must exist)
 *
 * @param {Object} req - Express request object (must have req.user from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminMiddleware = (req, res, next) => {
  // Check if user is authenticated AND has admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  // User is authorized, proceed to next middleware/route handler
  next();
};

module.exports = adminMiddleware;
