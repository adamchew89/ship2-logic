import { RequestHandler } from "express";
import { AccessType, Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import ServiceAuth from "z@Services/auths/service-auth";
import {
  validateAuthorizationScheme,
  validateAuthorizationToken,
} from "z@Utils/auths/utils-auth";
import Logger from "z@Utils/loggers/utils-logger";

type RequestHeader = {
  authorization: string;
};

type RequestBody = {
  user: Account;
};

type RequestParams = {
  id?: string;
  accountid?: string;
};

class MiddlewareAuth {
  private className = "MiddlewareAuth";
  private authService = new ServiceAuth();

  authenticate: RequestHandler = async (req, res, next) => {
    const headers = req.headers as RequestHeader;
    try {
      const token = validateAuthorizationScheme(headers.authorization);
      validateAuthorizationToken(token);
      const account = await this.authService.verifyAuthorization(token);
      req.body = { ...req.body, user: account };
      next();
    } catch (error) {
      next(error);
    }
  };

  isUserAuthorized: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    const accountId = params.id || params.accountid;
    if (body.user._id.toString() !== accountId) {
      let isAdmin = body.user.access === AccessType.ADMIN;
      if (!isAdmin) {
        Logger.debug(
          `[${this.className} - isUserAuthorized]: Unauthorized attempt`
        );
        return next(
          new ErrorBase(
            "User is not authorized to perform action",
            HTTPStatusCodes.UNAUTHORIZED,
            true
          )
        );
      }
    }
    next();
  };

  isAdminAuthorized: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const isAdmin = body.user.access === AccessType.ADMIN;
    if (!isAdmin) {
      Logger.debug(
        `[${this.className} - isUserAuthorized]: Unauthorized attempt`
      );
      return next(
        new ErrorBase(
          "User is not authorized to perform action",
          HTTPStatusCodes.UNAUTHORIZED,
          true
        )
      );
    }
    next();
  };
}

export default MiddlewareAuth;
