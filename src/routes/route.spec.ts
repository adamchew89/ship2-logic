import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import * as FixturesAccount from "z@Fixtures/accounts/fixture-account";
import Route from "./route";

class RouteMock extends Route {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {}
}

describe("[Route]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let mockRoute: RouteMock;

  beforeEach(() => {
    mockReq = getMockReq({
      body: FixturesAccount.accounts[0],
    });
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    mockRoute = new RouteMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should create an instance of RouteMock", () => {
    expect(mockRoute).toBeDefined();
    expect(mockRoute).toBeInstanceOf(RouteMock);
  });

  describe("[preserveBody]", () => {
    it("(Happy Path) should call next", () => {
      expect(mockNext).toHaveBeenCalledTimes(0);
      mockRoute.preserveBody(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("[restoreBody]", () => {
    it("(Happy Path) should call next", () => {
      expect(mockNext).toHaveBeenCalledTimes(0);
      mockRoute.restoreBody(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
