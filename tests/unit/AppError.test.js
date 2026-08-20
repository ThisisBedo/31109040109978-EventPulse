const AppError = require("../../utils/AppError");

describe("AppError Utility", () => {
  it("should format operational fail error for 400 status codes", () => {
    const err = new AppError("Bad Request", 400);
    expect(err.statusCode).toBe(400);
    expect(err.status).toBe("fail");
    expect(err.isOperational).toBe(true);
  });

  it("should format error status for 500 status codes", () => {
    const err = new AppError("Internal Server Error", 500);
    expect(err.statusCode).toBe(500);
    expect(err.status).toBe("error");
  });
});
