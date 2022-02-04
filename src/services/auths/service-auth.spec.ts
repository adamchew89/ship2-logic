import jwt, { JwtPayload } from "jsonwebtoken";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorUnauthorized from "z@Errors/error-unauthorized";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import ServiceAccount from "z@Services/accounts/service-account";
import { encrypt } from "z@Utils/auths/utils-auth";
import ServiceAuth from "./service-auth";

jest.mock("z@Services/accounts/service-account");

describe("[ServiceAuth]", () => {
  let authService: ServiceAuth;

  beforeEach(() => {
    authService = new ServiceAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ServiceAuth", () => {
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(ServiceAuth);
  });

  describe("verifyCredentials]", () => {
    let mockCredentials: Account;
    let mockPin: string;

    beforeEach(() => {
      mockCredentials = {
        name: "name",
        email: "email",
        mobile: "mobile",
      } as Account;
      mockPin = "pin";
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementation(async (criteria?: any, showSensitive?: boolean) =>
          Promise.resolve([
            {
              ...FixtureAccounts.accounts[0],
              hash: await encrypt(mockPin),
            },
          ])
        );
    });

    it("(Happy Path) should return JWT", async () => {
      expect(
        await authService.verifyCredentials(mockCredentials, mockPin)
      ).toBeDefined();
    });

    it("(Failure Path) should throw ErrorUnauthorized if account does not exists", async () => {
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementation(async (criteria?: any, showSensitive?: boolean) =>
          Promise.resolve([])
        );
      try {
        await authService.verifyCredentials(mockCredentials, mockPin);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorUnauthorized);
      }
    });

    it("(Failure Path) should throw ErrorUnauthorized if password comparison failed", async () => {
      try {
        await authService.verifyCredentials(mockCredentials, mockPin + "123");
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorUnauthorized);
      }
    });
  });

  describe("[verifyAuthorization]", () => {
    beforeEach(() => {
      jest
        .spyOn(jwt, "verify")
        .mockImplementation(() => ({ token: "token" } as JwtPayload));
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementation((criteria?: any) =>
          Promise.resolve([FixtureAccounts.accounts[0]])
        );
    });

    it("(Happy Path) should return Account", async () => {
      expect(await authService.verifyAuthorization("")).toMatchObject(
        FixtureAccounts.accounts[0]
      );
    });

    it("(Failure Path) should throw ErrorUnauthorized if account does not exists", async () => {
      expect.assertions(1);
      jest
        .spyOn(ServiceAccount.prototype, "findAccounts")
        .mockImplementationOnce(() => Promise.resolve([]));
      try {
        await authService.verifyAuthorization("");
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorUnauthorized);
      }
    });
  });

  describe("[changeCredentials]", () => {
    let mockPin: string;
    let mockNewPin: string;
    let mockFindAccountById: jest.SpyInstance;

    beforeEach(() => {
      mockPin = "pin";
      mockNewPin = "newPin";
      mockFindAccountById = jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation(async (criteria?: any, showSensitive?: boolean) =>
          Promise.resolve({
            ...FixtureAccounts.accounts[0],
            hash: await encrypt(mockPin),
          })
        );
    });

    it("(Happy Path) should return void", async () => {
      expect(mockFindAccountById).toHaveBeenCalledTimes(0);
      expect(
        await authService.changeCredentials(
          FixtureAccounts.accounts[0]._id,
          mockPin,
          mockNewPin
        )
      ).toBeUndefined();
      expect(mockFindAccountById).toHaveBeenCalledTimes(1);
    });

    it("(Failure Path) should throw ErrorUnauthorized when invalid pin provided", async () => {
      expect.assertions(1);
      jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation(async (criteria?: any, showSensitive?: boolean) =>
          Promise.resolve({
            ...FixtureAccounts.accounts[0],
            hash: await encrypt(mockNewPin),
          })
        );
      try {
        await authService.changeCredentials(
          FixtureAccounts.accounts[0]._id,
          mockPin,
          mockNewPin
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorUnauthorized);
      }
    });
  });

  describe("[resetCredentials]", () => {
    let mockNewPin: string;
    let mockFindAccountById: jest.SpyInstance;

    beforeEach(() => {
      mockNewPin = "newPin";
      mockFindAccountById = jest
        .spyOn(ServiceAccount.prototype, "findAccountById")
        .mockImplementation(async (criteria?: any, showSensitive?: boolean) =>
          Promise.resolve({
            ...FixtureAccounts.accounts[0],
          })
        );
    });

    it("(Happy Path) should return void", async () => {
      expect(mockFindAccountById).toHaveBeenCalledTimes(0);
      expect(
        await authService.resetCredentials(
          FixtureAccounts.accounts[0]._id,
          mockNewPin
        )
      ).toBeUndefined();
      expect(mockFindAccountById).toHaveBeenCalledTimes(1);
    });
  });
});
