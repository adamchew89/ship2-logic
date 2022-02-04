import typeorm, { ConnectionOptions } from "typeorm";
import * as Database from "./db";

jest.mock("typeorm");

describe("[DB]", () => {
  it("should contain functions", () => {
    expect(Database.connect).toBeDefined();
  });

  describe("[connect]", () => {
    it("(Happy Path) should not throw an error when called", async () => {
      try {
        await Database.connect();
      } catch (error) {
        fail();
      }
    });

    it("(Failure Path) should not throw an error when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(typeorm, "createConnection")
        .mockImplementationOnce((args: ConnectionOptions) =>
          Promise.reject(new Error())
        );
      try {
        await Database.connect();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
