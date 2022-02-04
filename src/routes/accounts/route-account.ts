import ControllerAccount from "z@Controllers/accounts/controller-account";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";

class RouteAccount extends Route {
  private authMiddleware = new MiddlewareAuth();
  private accountController = new ControllerAccount();
  private baseURI = "accounts";

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`/${this.baseURI}/init`, this.accountController.init);
    this.router.get(
      `/${this.baseURI}`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.getAllAccount
    );
    this.router.post(
      `/${this.baseURI}`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.createNewAccount
    );
    this.router.get(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.getExistingAccount
    );
    this.router.put(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.updateExistingAccount
    );
    this.router.delete(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.deleteExistingAccount
    );
    this.router.put(
      `/${this.baseURI}/:id/change-pin`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.accountController.changeAccountPin
    );
  }
}

export default RouteAccount;
