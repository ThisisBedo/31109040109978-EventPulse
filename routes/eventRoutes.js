const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const eventCtrl = require("../controllers/eventController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Get all events with filtering and pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of events retrieved
 */
router.get("/", eventCtrl.getEvents);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get("/:id", eventCtrl.getEventById);

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, date, city, capacity]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               city:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created
 *       403:
 *         description: Forbidden (Admin required)
 */
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category ID is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive integer"),
    validate,
  ],
  eventCtrl.createEvent
);

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated
 */
router.patch("/:id", requireAuth, requireRole("admin"), eventCtrl.updateEvent);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 */
router.delete("/:id", requireAuth, requireRole("admin"), eventCtrl.deleteEvent);

module.exports = router;