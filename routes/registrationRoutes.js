const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const regCtrl = require("../controllers/registrationController");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

router.use(requireAuth);

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Register for an event (Attendee)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event]
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event ID to register for
 *                 example: "66f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *       400:
 *         description: Already registered or event capacity reached
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.post(
  "/",
  [body("event").notEmpty().withMessage("Event ID is required"), validate],
  regCtrl.registerForEvent
);

/**
 * @openapi
 * /api/registrations/my:
 *   get:
 *     summary: Get my event registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's registrations
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get("/my", regCtrl.getMyRegistrations);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel an event registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration successfully cancelled
 *       404:
 *         description: Registration not found
 */
router.delete("/:id", regCtrl.cancelRegistration);

module.exports = router;