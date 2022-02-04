import { RequestHandler } from "express";
import _ from "lodash";
import { AccessType, Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import ServiceAccount from "z@Services/accounts/service-account";
import ServiceAuth from "z@Services/auths/service-auth";
import { encrypt } from "z@Utils/auths/utils-auth";
import Logger from "z@Utils/loggers/utils-logger";

export interface Credential {
  name: string;
  email: string;
  mobile: string;
  pin: string;
  newPin?: string;
}

type RequestBody = {
  user: Account;
} & Credential;

type RequestParams = {
  id: string;
};

class ControllerAccount {
  private className = "ControllerAccount";
  private accountService = new ServiceAccount();
  private authService = new ServiceAuth();

  init: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    try {
      const existingAccounts = await this.accountService.findAccounts();
      if (!_.isEmpty(existingAccounts)) {
        Logger.debug(`[${this.className} - init]: Existing account`);
        return next(
          new ErrorBase(
            "Account creation failed.",
            HTTPStatusCodes.CONFLICT,
            true
          )
        );
      }
      const data: Account = {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        access: AccessType.ADMIN,
        hash: await encrypt(body.pin),
      } as Account;
      const newAccount = await this.accountService.createAccount(data);
      const newSanitizedAccount = await this.accountService.findAccountById(
        newAccount._id
      );
      res.status(HTTPStatusCodes.CREATED).json({
        message: "New admin account created.",
        data: newSanitizedAccount,
      });
    } catch (error) {
      next(error);
    }
  };

  getExistingAccount: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const existingAccount = await this.accountService.findAccountById(
        params.id
      );
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: existingAccount,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllAccount: RequestHandler = async (req, res, next) => {
    try {
      const newAccount: Account[] = await this.accountService.findAccounts();
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: newAccount });
    } catch (error) {
      next(error);
    }
  };

  createNewAccount: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    try {
      const existingAccounts = await this.accountService.findAccounts({
        email: body.email,
      });
      if (!_.isEmpty(existingAccounts)) {
        Logger.debug(
          `[${this.className} - createNewAccount]: Existing account`
        );
        return next(
          new ErrorBase(
            "Account creation failed.",
            HTTPStatusCodes.CONFLICT,
            true
          )
        );
      }
      const data: Account = {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        hash: await encrypt(body.pin),
      } as Account;
      const newAccount = await this.accountService.createAccount(data);
      const newSanitizedAccount = await this.accountService.findAccountById(
        newAccount._id
      );
      res
        .status(HTTPStatusCodes.CREATED)
        .json({ message: "New account created.", data: newSanitizedAccount });
    } catch (error) {
      next(error);
    }
  };

  updateExistingAccount: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      const account: Account = await this.accountService.findAccountById(
        params.id
      );
      account.name = body.name;
      account.email = body.email;
      account.mobile = body.mobile;
      const data: Account = await this.accountService.updateAccount(account);
      return res.status(HTTPStatusCodes.OK).json({
        message: "Account updated",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteExistingAccount: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const deletedAccount = await this.accountService.deleteAccount(params.id);
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Account deleted.", data: deletedAccount });
    } catch (error) {
      next(error);
    }
  };

  changeAccountPin: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      await this.authService.changeCredentials(
        params.id,
        body.pin,
        body.newPin!
      );
      res.status(HTTPStatusCodes.OK).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  };
}

export default ControllerAccount;
