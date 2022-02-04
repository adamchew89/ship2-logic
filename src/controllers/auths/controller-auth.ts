import { RequestHandler } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import { HTTPStatusCodes } from "z@Errors/error-base";
import ServiceAuth from "z@Services/auths/service-auth";

type RequestBody = {
  email: string;
  mobile: string;
  pin: string;
  newPin?: string;
  token?: string;
};

type RequestParams = {
  accountid: string;
};

class ControllerAuth {
  private authService = new ServiceAuth();

  login: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const data: Account = {
      mobile: body.mobile,
    } as Account;
    try {
      const authenticationData = await this.authService.verifyCredentials(
        data,
        body.pin
      );
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: authenticationData });
    } catch (error) {
      next(error);
    }
  };

  verifyToken: RequestHandler = async (req, res, next) =>
    res.status(HTTPStatusCodes.OK).json({ message: "Success" });

  resetPin: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      await this.authService.resetCredentials(+params.accountid, body.newPin!);
      res.status(HTTPStatusCodes.OK).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  };
}
export default ControllerAuth;
