const Event = require("../models/event.model");
const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, page, limit, sortBy, order, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ["date", "title", "capacity", "createdAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const sortDirection = order === "desc" ? -1 : 1;

  const [data, total] = await Promise.all([
    Event.find(filter).populate("category").sort({ [sortField]: sortDirection }).skip(skip).limit(limitNum),
    Event.countDocuments(filter)
  ]);

  res.status(200).json({ status: "success", total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum), data });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate("category").populate("organizer");
  if (!event) return next(new AppError("Event not found", 404));
  res.status(200).json({ status: "success", data: event });
});

exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({ ...req.body, organizer: req.user.userId });
  res.status(201).json({ status: "success", data: event });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) return next(new AppError("Event not found", 404));
  res.status(200).json({ status: "success", data: event });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError("Event not found", 404));
  res.status(200).json({ status: "success", data: null });
});
