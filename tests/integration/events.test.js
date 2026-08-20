const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../server");
const Event = require("../../models/event.model");

describe("Events API Integration Tests", () => {
  beforeAll(async () => {
    // Prevent real Mongoose connection attempts from timing out Jest
    jest.spyOn(mongoose, "connect").mockResolvedValue(true);
  });

  afterAll(async () => {
    // Ensure active handles are closed cleanly
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it("GET /health endpoint should return status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  it("GET /api/events should return 200 OK", async () => {
    // Mock Event queries so tests run in-memory without waiting on MongoDB
    jest.spyOn(Event, "find").mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    }));
    jest.spyOn(Event, "countDocuments").mockResolvedValue(0);

    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");

    jest.restoreAllMocks();
  });

  it("POST /api/events without authentication should return 401 Unauthorized", async () => {
    const res = await request(app).post("/api/events").send({ title: "Unauthorized Event" });
    expect(res.statusCode).toBe(401);
  });
});