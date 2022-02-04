import { level } from "z@Utils/loggers/utils-logger";

jest.mock("fs");
jest.mock("envalid");
jest.mock("z@Utils/env/utils-env", () =>
  jest.fn().mockImplementation(() => ({ isDevelopment: false }))
);

describe("[UtilsLogger]", () => {
  describe("[level]", () => {
    it('should return "debug" if environment is in development', () => {
      expect(level(true)).toBe("debug");
    });
    it('should return "http" if environment is not in development', () => {
      expect(level(false)).toBe("http");
    });
  });
});
