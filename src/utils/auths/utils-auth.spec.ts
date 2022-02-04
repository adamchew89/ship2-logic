import jwt from "jsonwebtoken";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import * as UtilsAuth from "./utils-auth";
import ENV from "z@Utils/env/utils-env";

jest.mock("z@Utils/env/utils-env", () => ({ JWT_SECRET: "text" }));

describe("[UtilsAuth]", () => {
  describe("[validateAuthorizationToken]", () => {
    it("(Happy Path) should return void if token is valid", () => {
      expect(
        UtilsAuth.validateAuthorizationToken(
          jwt.sign(
            {
              token: "randomstring",
            },
            ENV.JWT_SECRET,
            {
              algorithm: "HS256",
              expiresIn: "1h",
            }
          )
        )
      ).toBeUndefined();
    });

    it("(Failure Path) should throw NOT_ACCEPTABLE if token is invalid", () => {
      expect.assertions(1);
      try {
        UtilsAuth.validateAuthorizationToken("");
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(
          HTTPStatusCodes.NOT_ACCEPTABLE
        );
      }
    });
  });

  describe("[validateAuthorizationScheme]", () => {
    it("(Happy Path) should return true if authorization scheme is valid", () => {
      expect(UtilsAuth.validateAuthorizationScheme("Bearer randomstring"));
    });

    it("(Failure Path) should throw FORBIDDEN if authorization is missing", () => {
      expect.assertions(1);
      try {
        UtilsAuth.validateAuthorizationScheme("");
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(HTTPStatusCodes.FORBIDDEN);
      }
    });

    it("(Failure Path) should throw Failure BAD_REQUEST if scheme length is less than two", () => {
      expect.assertions(1);
      try {
        UtilsAuth.validateAuthorizationScheme("A");
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(
          HTTPStatusCodes.BAD_REQUEST
        );
      }
    });

    it("(Failure Path) should throw Failure BAD_REQUEST if scheme length is more than two", () => {
      expect.assertions(1);
      try {
        UtilsAuth.validateAuthorizationScheme("A B C");
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(
          HTTPStatusCodes.BAD_REQUEST
        );
      }
    });
    it("(Failure Path) should throw Failure FORBIDDEN if scheme is not OAuth", () => {
      expect.assertions(1);
      try {
        UtilsAuth.validateAuthorizationScheme("A B");
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(HTTPStatusCodes.FORBIDDEN);
      }
    });
  });
});
