const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
  password: { type: String, required: [true, "Password is required"], select: false },
  role: { type: String, enum: ["attendee", "admin"], default: "attendee" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
