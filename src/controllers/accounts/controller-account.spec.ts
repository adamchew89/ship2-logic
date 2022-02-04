import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import ServiceAccount from "z@Services/accounts/service-account";
import ServiceAuth from "z@Services/auths/service-auth";
import ControllerAccount from "./controller-account";

jest.mock("z@Services/accounts/service-account");
jest.mock("z@Services/auths/service-auth");
jest.mock("z@Services/replies/service-reply");

describe("[ControllerAccount]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let accountController: ControllerAccount;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    accountController = new ControllerAccount();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ControllerAccount", () => {
    expect(accountController).toBeDefined();
    expect(accountController).toBeInstanceOf(ControllerAccount);
  });

  describe("[init]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: FixtureAccounts.credentials[0],
      });
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementation((criteria: any) => Promise.resolve([]));
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation((id: string) =>
          Promise.resolve(FixtureAccounts.accounts[0])
        );
      jest
        .spyOn(ServiceAccount.prototype, "createAccount")
        .mockImplementation((account: Account) =>
          Promise.resolve(FixtureAccounts.accounts[0])
        );
    });

    it("(Happy Path) should return Success CREATED", async () => {
      await accountController.init(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.CREATED);
    });

    it("(Failure Path) show return Failure when account exists", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureAccounts.accounts)
        );
      await accountController.init(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(ErrorBase));
    });

    it("(Failure Path) show return Failure when account was not created successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "createAccount")
        .mockImplementationOnce((account: Account) =>
          Promise.reject(new Error())
        );
      await accountController.init(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[getExistingAccount]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[0]._id },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await accountController.getExistingAccount(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when account was not retrieved successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await accountController.getExistingAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[getAllAccount]", () => {
    it("(Happy Path) should return Success OK", async () => {
      await accountController.getAllAccount(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when accounts were not retrieved successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await accountController.getAllAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[createNewAccount]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: FixtureAccounts.credentials[0],
      });
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementation((criteria: any) => Promise.resolve([]));
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation((id: string) =>
          Promise.resolve(FixtureAccounts.accounts[0])
        );
      jest
        .spyOn(ServiceAccount.prototype, "createAccount")
        .mockImplementation((account: Account) =>
          Promise.resolve(FixtureAccounts.accounts[0])
        );
    });

    it("(Happy Path) should return Success CREATED", async () => {
      await accountController.createNewAccount(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.CREATED);
    });

    it("(Failure Path) show return Failure when account exists", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureAccounts.accounts)
        );
      await accountController.createNewAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(ErrorBase));
    });

    it("(Failure Path) show return Failure when account was not created successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "createAccount")
        .mockImplementationOnce((account: Account) =>
          Promise.reject(new Error())
        );
      await accountController.createNewAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[updateExistingAccount]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: FixtureAccounts.accounts[0],
        params: { id: FixtureAccounts.accounts[0]._id },
      });
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation((id: string) =>
          Promise.resolve(FixtureAccounts.accounts[0])
        );
    });

    it("(Happy Path) should return Success OK", async () => {
      await accountController.updateExistingAccount(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) show return Failure if account was not retrieved successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await accountController.updateExistingAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("(Failure Path) show return Failure if account could not update successfully", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "updateAccount")
        .mockImplementationOnce((account: Account) =>
          Promise.reject(new Error())
        );
      await accountController.updateExistingAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[deleteExistingAccount]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        params: { id: FixtureAccounts.accounts[0]._id },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await accountController.deleteExistingAccount(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) show return Failure if account does not exists", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "deleteAccount")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await accountController.deleteExistingAccount(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[changeAccountPin]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: { pin: "pin", newPin: "newPin" },
        params: { id: FixtureAccounts.accounts[0]._id },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await accountController.changeAccountPin(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should call next when failed to change pin", async () => {
      jest
        .spyOn(ServiceAuth.prototype, "changeCredentials")
        .mockImplementationOnce((id: string, pin: string, newPin: string) =>
          Promise.reject(new Error())
        );
      await accountController.changeAccountPin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
