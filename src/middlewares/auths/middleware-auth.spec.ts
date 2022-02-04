import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import ErrorBase from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import ServiceAuth from "z@Services/auths/service-auth";
import MiddlewareAuth from "./middleware-auth";

jest.mock("z@Services/auths/service-auth");
jest.mock("z@Utils/auths/utils-auth");

describe("[MiddlewareAuth]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let authMiddleware: MiddlewareAuth;

  beforeEach(() => {
    mockReq = getMockReq({
      headers: { authorization: "" },
      params: { id: FixtureAccounts.accounts[1]._id },
      /**
       * Set authorized user as 'normal' account
       */
      body: { user: FixtureAccounts.accounts[1] },
    });
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    authMiddleware = new MiddlewareAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of MiddlewareAuth", () => {
    expect(authMiddleware).toBeDefined();
    expect(authMiddleware).toBeInstanceOf(MiddlewareAuth);
  });

  describe("[authenticate]", () => {
    it("(Happy Path) should call next without arguments", async () => {
      await authMiddleware.authenticate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("(Failure Path) should call next with Error", async () => {
      jest
        .spyOn(ServiceAuth.prototype, "verifyAuthorization")
        .mockImplementationOnce(() => Promise.reject(new Error()));
      await authMiddleware.authenticate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[isUserAuthorized]", () => {
    it("(Happy Path) should call next without arguments when 'admin' user accessing own data", async () => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[0]._id },
        body: { user: FixtureAccounts.accounts[0] },
      });
      await authMiddleware.isUserAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("(Happy Path) should call next without arguments when 'admin' user accessing other data", async () => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[1]._id },
        body: { user: FixtureAccounts.accounts[0] },
      });
      await authMiddleware.isUserAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("(Happy Path) should call next without arguments when 'normal' user accessing own data", async () => {
      await authMiddleware.isUserAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("(Failure Path) should call next with ErrorBase when 'normal' user access other data", async () => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[2]._id },
        body: { user: FixtureAccounts.accounts[1] },
      });
      await authMiddleware.isUserAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorBase));
    });
  });

  describe("[isAdminAuthorized]", () => {
    it("(Happy Path) should call next without arguments when accessed by 'admin' user", async () => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[2]._id },
        body: { user: FixtureAccounts.accounts[0] },
      });
      await authMiddleware.isAdminAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("(Failure Path) should call next without arguments when accessed by 'normal' user", async () => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[2]._id },
        body: { user: FixtureAccounts.accounts[1] },
      });
      await authMiddleware.isAdminAuthorized(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorBase));
    });
  });
});
