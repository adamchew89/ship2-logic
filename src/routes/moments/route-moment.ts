import multer from "multer";
import ControllerMoment from "z@Controllers/moments/controller-moment";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";
import ENV from "z@Utils/env/utils-env";

class RouteMoment extends Route {
  private upload = multer({ dest: ENV.TEMP_DIR });
  private authMiddleware = new MiddlewareAuth();
  private momentController = new ControllerMoment();
  private baseURI = "moments";

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `/${this.baseURI}`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.momentController.getAllExistingMoments
    );
    this.router.get(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.momentController.getExistingMoment
    );
    this.router.post(
      `/${this.baseURI}`,
      this.authMiddleware.authenticate,
      this.preserveBody,
      this.upload.array("files", 5),
      this.restoreBody,
      this.momentController.createNewMoment
    );
    this.router.delete(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.momentController.deleteExistingMoment
    );
  }
}

export default RouteMoment;
