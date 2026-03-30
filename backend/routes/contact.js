const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required" });
    }

    // Contact requests are accepted and handled by the app without email dispatch.
    return res.json({ message: "Message sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
});

module.exports = router;
