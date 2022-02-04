import { stream, skip } from "z@Middlewares/loggers/middleware-logger";
import Logger from "z@Utils/loggers/utils-logger";

jest.mock("z@Utils/loggers/utils-logger");

describe("[MiddlewareLogger]", () => {
  describe("[stream]", () => {
    describe("[write]", () => {
      it("should call Logger when called", () => {
        expect(Logger.http).toHaveBeenCalledTimes(0);
        stream.write("test");
        expect(Logger.http).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("[skip]", () => {
    it("should return true when called in test environment", () => {
      expect(skip()).toBeTruthy();
    });
  });
});
