const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Register a new user
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'attendee'
  });

  // 4. Generate JWT using process.env variables
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'a_long_random_string_no_one_can_guess',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 5. Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Login existing user
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2. Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3. Generate JWT using process.env variables
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'a_long_random_string_no_one_can_guess',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 4. Send response
  res.status(200).json({
    status: 'success',
    token
  });
});