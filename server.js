require("dotenv").config();
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

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

// Swagger JSDoc Options Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventPulse API",
      version: "1.0.0",
      description: "EventPulse Backend API Documentation",
    },
    servers: [
      {
        url: "https://31109040109978-event-pulse.vercel.app",
        description: "Production Server (Vercel)",
      },
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
  },
  // Paths to files containing OpenAPI/Swagger annotations
  apis: [
    "./routes/*.js",
    "./controllers/*.js",
    "./models/*.js",
    "./server.js",
  ],
};

// Generate Swagger Spec and Mount UI with CDN assets for Vercel compatibility
try {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  const SWAGGER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5";

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: `${SWAGGER_CDN}/swagger-ui.min.css`,
      customJs: [
        `${SWAGGER_CDN}/swagger-ui-bundle.js`,
        `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
      ],
    })
  );
} catch (err) {
  console.error("Swagger generation failed:", err.message);
  app.get("/api-docs", (req, res) => {
    res.status(500).json({
      status: "error",
      message: "Failed to generate Swagger documentation",
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

// 404 Handler & Error Middleware
app.use((req, res) =>
  res.status(404).json({ status: "fail", message: "Route not found" })
);
app.use(errorHandler);

// Only listen on port in local or non-Vercel environments
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for Vercel serverless execution
module.exports = app;