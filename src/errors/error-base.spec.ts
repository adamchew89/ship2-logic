import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import ErrorBase, { errorHandler, HTTPStatusCodes } from "./error-base";

describe("[ErrorBase]", () => {
  const baseErrors: ErrorBase[] = [
    new ErrorBase("Test", HTTPStatusCodes.BAD_REQUEST, true),
    new ErrorBase("Test", HTTPStatusCodes.CONFLICT, true),
    new ErrorBase("Test", HTTPStatusCodes.CREATED, true),
    new ErrorBase("Test", HTTPStatusCodes.FORBIDDEN, true),
    new ErrorBase("Test", HTTPStatusCodes.INTERNAL_SERVER_ERROR, true),
    new ErrorBase("Test", HTTPStatusCodes.NOT_ACCEPTABLE, true),
    new ErrorBase("Test", HTTPStatusCodes.NOT_FOUND, true),
    new ErrorBase("Test", HTTPStatusCodes.OK, true),
    new ErrorBase("Test", HTTPStatusCodes.UNAUTHORIZED, true),
  ];

  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let errorBase: ErrorBase;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    errorBase = new ErrorBase(
      "Test",
      HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      true
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ErrorBase", () => {
    expect(errorBase).toBeDefined();
    expect(errorBase).toBeInstanceOf(ErrorBase);
  });

  describe("[errorHandler]", () => {
    it("(Happy Path) should return Failure INTERNAL_SERVER_ERROR by default", () => {
      errorHandler(new ErrorBase("", 0, true), mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    });

    baseErrors.forEach((mockErr: ErrorBase) => {
      it(`(Happy Path) should return Success/Failure ${mockErr.statusCode}`, async () => {
        errorHandler(mockErr, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(mockErr.statusCode);
      });
    });
  });
});
