const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const validate = require("../middleware/validate");

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate
], authCtrl.register);

router.post("/login", [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate
], authCtrl.login);

module.exports = router;
