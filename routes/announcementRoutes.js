const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const announcementCtrl = require("../controllers/announcementController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

router.post("/", requireAuth, requireRole("admin"), [
  body("eventId").notEmpty().withMessage("Event ID is required"),
  body("text").notEmpty().withMessage("Announcement text is required"),
  validate
], announcementCtrl.createAnnouncement);

router.get("/:eventId", announcementCtrl.getAnnouncements);

module.exports = router;
