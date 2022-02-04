import typeorm from "typeorm";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccount from "z@Fixtures/accounts/fixture-account";
import ServiceAccount from "./service-account";

jest.mock("typeorm");
jest.mock("z@DBs/schemas/accounts/schema-account");

describe("[ServiceAccount]", () => {
  let accountService: ServiceAccount;

  beforeEach(() => {
    accountService = new ServiceAccount();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ServiceAccount", () => {
    expect(accountService).toBeDefined();
    expect(accountService).toBeInstanceOf(ServiceAccount);
  });

  describe("[findAccounts]", () => {
    it("(Happy Path) should return Account[] when called", async () => {
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve([FixtureAccount.accounts])
        );
      const response = await accountService.findAccounts();
      expect(response).toMatchObject([FixtureAccount.accounts]);
    });

    it("(Happy Path) should return Account[] with sensitive query when called", async () => {
      const mockSelect = jest.fn();
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: mockSelect.mockImplementationOnce(() => ({
              select: mockSelect.mockImplementationOnce(() => ({
                exec: jest
                  .fn()
                  .mockResolvedValueOnce([FixtureAccount.accounts[0]]),
              })),
            })),
          }))
        );
      await accountService.findAccounts(undefined, true);
      expect(mockSelect).toHaveBeenCalledTimes(2);
    });
  });

  describe("[findAccountById]", () => {
    it("(Happy Path) should return Account when called", async () => {
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve(FixtureAccount.accounts[0])
        );
      const response = await accountService.findAccountById(
        FixtureAccount.accounts[0]._id
      );
      expect(response).toMatchObject(FixtureAccount.accounts[0]);
    });

    it("(Happy Path) should return Account with sensitive query when called", async () => {
      const mockSelect = jest.fn();
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: mockSelect.mockImplementationOnce(() => ({
              select: mockSelect.mockImplementationOnce(() => ({
                exec: jest
                  .fn()
                  .mockResolvedValueOnce(FixtureAccount.accounts[0]),
              })),
            })),
          }))
        );
      await accountService.findAccountById(
        FixtureAccount.accounts[0]._id,
        true
      );
      expect(mockSelect).toHaveBeenCalledTimes(2);
    });

    it("(Failure Path) should return Failure NOT_FOUND when called with invalid id", async () => {
      expect.assertions(1);
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await accountService.findAccountById(FixtureAccount.accounts[0]._id);
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(HTTPStatusCodes.NOT_FOUND);
      }
    });
  });

  describe("[createAccount]", () => {
    it("(Happy Path) should return Account when called", async () => {
      jest
        .spyOn(typeorm.getManager.prototype, "save")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureAccount.accounts[0])
        );
      const response = await accountService.createAccount(
        FixtureAccount.accounts[0]
      );
      expect(response).toMatchObject(FixtureAccount.accounts[0]);
    });
  });

  describe("[updateAccount]", () => {
    it("(Happy Path) should return Account when called", async () => {
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve({ ...FixtureAccount.accounts[0], save: jest.fn() })
        );
      const response = await accountService.updateAccount(
        FixtureAccount.accounts[0]
      );
      expect(response).toMatchObject(FixtureAccount.accounts[0]);
    });

    it("(Happy Path) should return Failure INTERNAL_SERVER_ERROR when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await accountService.updateAccount(FixtureAccount.accounts[0]);
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(
          HTTPStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
  });

  describe("[deleteAccount]", () => {
    it("(Happy Path) should return Account when called", async () => {
      jest
        .spyOn(typeorm.getManager.prototype, "find")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve({ ...FixtureAccount.accounts[0], remove: jest.fn() })
        );
      const response = await accountService.deleteAccount(
        FixtureAccount.accounts[0]._id
      );
      expect(response).toMatchObject(FixtureAccount.accounts[0]);
    });
  });

  it("(Happy Path) should return Failure NOT_FOUND when called", async () => {
    expect.assertions(1);
    jest
      .spyOn(typeorm.getManager.prototype, "find")
      // @ts-ignore
      .mockImplementationOnce((id: string) => Promise.resolve());
    try {
      await accountService.deleteAccount(FixtureAccount.accounts[0]._id);
    } catch (error) {
      expect((error as ErrorBase).statusCode).toBe(HTTPStatusCodes.NOT_FOUND);
    }
  });
});
