import ErrorBase, { HTTPStatusCodes } from "./error-base";

class ErrorUnauthorized extends ErrorBase {
  constructor(name: string = "Account credentials invalid") {
    super(name, HTTPStatusCodes.UNAUTHORIZED, true);
  }
}

export default ErrorUnauthorized;
