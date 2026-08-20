require("dotenv").config();
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);

// Database Connection
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to EventPulse API!",
    docs: "/api-docs",
    health: "/health",
  });
});

// Safe Swagger API Docs Setup (handles path or file loading issues without crashing)
try {
  // Adjust this require path to match your swagger file location (e.g., "./swagger.json")
  const swaggerDocument = require("./swagger.json");
  const SWAGGER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5";

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCssUrl: `${SWAGGER_CDN}/swagger-ui.min.css`,
      customJs: [
        `${SWAGGER_CDN}/swagger-ui-bundle.js`,
        `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
      ],
    })
  );
} catch (err) {
  console.error("Swagger setup skipped or failed:", err.message);
  app.get("/api-docs", (req, res) => {
    res.status(500).json({
      status: "error",
      message: "Swagger documentation failed to load on server.",
      details: err.message,
    });
  });
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/announcements", announcementRoutes);

// Health Check Endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.status(200).json({
    status: "ok",
    dbStatus: statusMap[dbState] || "unknown",
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 & Error Handlers
app.use((req, res) =>
  res.status(404).json({ status: "fail", message: "Route not found" })
);
app.use(errorHandler);

// Only listen on port in traditional local/server environments
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export Express app for Vercel serverless execution
module.exports = app;