const asyncHandler = require("../../utils/asyncHandler");

describe("asyncHandler Utility", () => {
  it("should resolve wrapped async functions successfully", async () => {
    const mockReq = {};
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockNext = jest.fn();

    const fn = asyncHandler(async (req, res, next) => {
      res.status(200).json({ success: true });
    });

    await fn(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should catch rejected promises and forward error to next", async () => {
    const mockNext = jest.fn();
    const mockFn = jest.fn().mockRejectedValue(new Error("Async Failure"));

    const handler = asyncHandler(mockFn);
    await handler({}, {}, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
