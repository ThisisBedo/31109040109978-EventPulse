const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const announcementCtrl = require("../controllers/announcementController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

/**
 * @openapi
 * /api/announcements:
 *   post:
 *     summary: Broadcast a real-time announcement (Admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId, text]
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: Target Event ID
 *               text:
 *                 type: string
 *                 description: Announcement message text
 *     responses:
 *       201:
 *         description: Announcement successfully created and broadcasted via Socket.io
 *       403:
 *         description: Forbidden - Admin authorization required
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("text").notEmpty().withMessage("Announcement text is required"),
    validate,
  ],
  announcementCtrl.createAnnouncement
);

/**
 * @openapi
 * /api/announcements/{eventId}:
 *   get:
 *     summary: Get all announcements for a specific event
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of announcements retrieved
 */
router.get("/:eventId", announcementCtrl.getAnnouncements);

module.exports = router;