require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Updated paths for root directory execution
const User = require("./models/user.model");
const Category = require("./models/category.model");
const Event = require("./models/event.model");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventpulse");
    console.log("Connected to DB for seeding...");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});

    const adminPassword = await bcrypt.hash("Admin123!", 12);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@eventpulse.com",
      password: adminPassword,
      role: "admin"
    });

    const categories = await Category.insertMany([
      { name: "Tech", description: "Technology and Software Conferences" },
      { name: "Music", description: "Live Concerts and Festivals" },
      { name: "Sports", description: "Tournaments and Fitness Events" }
    ]);

    await Event.create({
      title: "Global Tech Summit 2026",
      description: "Annual flagship technology and AI conference.",
      category: categories[0]._id,
      date: new Date("2026-10-15"),
      city: "Cairo",
      venue: "Cairo International Convention Centre",
      capacity: 500,
      organizer: adminUser._id
    });

    console.log("Database successfully seeded!");
    console.log(`Admin email: admin@eventpulse.com | Password: Admin123!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();