const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

router.patch(
  "/admin/:userId/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Role must be user or admin" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true, select: "-password" },
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User role updated", user: updatedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user role", error: error.message });
    }
  },
);

module.exports = router;
