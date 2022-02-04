import ControllerReply from "z@Controllers/replies/controller-reply";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";

class RouteReply extends Route {
  private authMiddleware = new MiddlewareAuth();
  private replyController = new ControllerReply();
  private baseURI = "replies";

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `/${this.baseURI}`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isAdminAuthorized,
      this.replyController.getAllExistingReplies
    );
    this.router.get(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.replyController.getExistingReply
    );
  }
}

export default RouteReply;
