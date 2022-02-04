import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import ServiceAuth from "z@Services/auths/service-auth";
import ControllerAuth from "./controller-auth";

jest.mock("z@Services/auths/service-auth");

describe("[ControllerAuth]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let authController: ControllerAuth;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    authController = new ControllerAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ControllerAuth", () => {
    expect(authController).toBeDefined();
    expect(authController).toBeInstanceOf(ControllerAuth);
  });

  describe("[login]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: FixtureAccounts.accounts[0],
        params: { id: FixtureAccounts.accounts[0]._id },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await authController.login(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should call next when failed to verify", async () => {
      jest
        .spyOn(ServiceAuth.prototype, "verifyCredentials")
        .mockImplementationOnce((account: Account, pin: string) =>
          Promise.reject(new Error())
        );
      await authController.login(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[verifyToken]", () => {
    it("(Happy Path) should return Success OK", async () => {
      await authController.verifyToken(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });
  });

  describe("[resetPin]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: { newPin: "newPin" },
        params: { id: FixtureAccounts.accounts[0]._id },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await authController.resetPin(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should call next when failed to change pin", async () => {
      jest
        .spyOn(ServiceAuth.prototype, "resetCredentials")
        .mockImplementationOnce((id: string, newPin: string) =>
          Promise.reject(new Error())
        );
      await authController.resetPin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
