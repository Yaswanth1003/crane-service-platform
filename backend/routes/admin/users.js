const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

router.patch(
  "/:userId/role",
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

router.delete("/:userId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(req.user.id) === String(userId)) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
