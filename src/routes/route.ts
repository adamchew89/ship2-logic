import { RequestHandler, Router } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";

abstract class Route {
  public router = Router();
  private user?: Account;

  constructor() {}

  abstract initializeRoutes(): void;

  public preserveBody: RequestHandler = (req, res, next) => {
    this.user = req.body.user;
    next();
  };

  public restoreBody: RequestHandler = (req, res, next) => {
    req.body = { ...req.body, user: this.user };
    this.user = undefined;
    next();
  };
}

export default Route;
