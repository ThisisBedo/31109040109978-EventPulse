const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const regCtrl = require("../controllers/registrationController");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");

router.use(requireAuth);

router.post("/", [
  body("event").notEmpty().withMessage("Event ID is required"),
  validate
], regCtrl.registerForEvent);

router.get("/my", regCtrl.getMyRegistrations);
router.delete("/:id", regCtrl.cancelRegistration);

module.exports = router;
