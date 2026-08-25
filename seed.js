require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user.model");
const Category = require("./models/category.model");
const Event = require("./models/event.model");
const Registration = require("./models/registration.model");
const Message = require("./models/message.model");

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("Fatal Error: MONGO_URI is missing from environment variables (.env).");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to DB for seeding...");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Message.deleteMany({});

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
      title: "AI & Future Tech Summit '26",
      description: "Annual flagship technology and AI conference.",
      category: categories[0]._id,
      date: new Date("2026-10-15"),
      city: "Cairo",
      venue: "Cairo International Convention Centre",
      capacity: 500,
      organizer: adminUser._id
    });

    await Event.create({
      title: "1-on-1 CTO Masterclass [VIP Only]",
      description: "One-on-one executive mentoring session.",
      category: categories[0]._id,
      date: new Date("2026-11-20"),
      city: "Cairo",
      venue: "Private Executive Lounge",
      capacity: 1,
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