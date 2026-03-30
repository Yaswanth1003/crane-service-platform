const express = require("express");
const router = express.Router();
const Service = require("../../models/Service");
const authMiddleware = require("../../middleware/auth");
const adminMiddleware = require("../../middleware/admin");

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.json(services);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      model,
      category,
      pricePerHour,
      pricePerDay,
      description,
      imageUrl,
    } = req.body;

    if (!name || !model || !category || !pricePerHour || !pricePerDay) {
      return res.status(400).json({
        message:
          "name, model, category, pricePerHour and pricePerDay are required",
      });
    }

    const service = await Service.create({
      name: String(name).trim(),
      model: String(model).trim(),
      category: String(category).trim(),
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      description: description ? String(description).trim() : "",
      imageUrl: imageUrl ? String(imageUrl).trim() : "",
    });

    return res.status(201).json({ message: "Service created", service });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
});

router.patch(
  "/:serviceId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { serviceId } = req.params;
      const {
        name,
        model,
        category,
        pricePerHour,
        pricePerDay,
        description,
        imageUrl,
      } = req.body;

      if (!name || !model || !category || !pricePerHour || !pricePerDay) {
        return res.status(400).json({
          message:
            "name, model, category, pricePerHour and pricePerDay are required",
        });
      }

      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        {
          name: String(name).trim(),
          model: String(model).trim(),
          category: String(category).trim(),
          pricePerHour: Number(pricePerHour),
          pricePerDay: Number(pricePerDay),
          description: description ? String(description).trim() : "",
          imageUrl: imageUrl ? String(imageUrl).trim() : "",
        },
        { new: true, runValidators: true },
      );

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.json({ message: "Service updated", service: updatedService });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating service", error: error.message });
    }
  },
);

router.delete(
  "/:serviceId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { serviceId } = req.params;
      const deleted = await Service.findByIdAndDelete(serviceId);

      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.json({ message: "Service deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting service", error: error.message });
    }
  },
);

module.exports = router;
