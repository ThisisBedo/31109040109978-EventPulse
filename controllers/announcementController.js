const Message = require("../models/message.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;
  const message = await Message.create({ event: eventId, text, sender: req.user.userId });

  const io = req.app.get("io");
  if (io) io.to(eventId).emit("announcement", message);

  res.status(201).json({ status: "success", data: message });
});

exports.getAnnouncements = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ event: req.params.eventId }).sort({ createdAt: 1 }).populate("sender", "name email");
  res.status(200).json({ status: "success", results: messages.length, data: messages });
});
