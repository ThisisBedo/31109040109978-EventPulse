const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const eventCtrl = require("../controllers/eventController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

router.get("/", eventCtrl.getEvents);
router.get("/:id", eventCtrl.getEventById);

router.post("/", requireAuth, requireRole("admin"), [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category ID is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
  validate
], eventCtrl.createEvent);

router.patch("/:id", requireAuth, requireRole("admin"), eventCtrl.updateEvent);
router.delete("/:id", requireAuth, requireRole("admin"), eventCtrl.deleteEvent);

module.exports = router;
