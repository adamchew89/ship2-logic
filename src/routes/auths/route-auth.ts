import ControllerAuth from "z@Controllers/auths/controller-auth";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";

class RouteAuth extends Route {
  private authMiddleware = new MiddlewareAuth();
  private authController = new ControllerAuth();
  private baseURI = "auth";

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`/${this.baseURI}`, this.authController.login);
    this.router.get(
      `/${this.baseURI}/:accountid/verifyToken`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.authController.verifyToken
    );
    this.router.put(
      `/${this.baseURI}/:accountid/reset-pin`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isAdminAuthorized,
      this.authController.resetPin
    );
  }
}

export default RouteAuth;
