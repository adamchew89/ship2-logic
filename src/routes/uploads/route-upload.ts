import multer from "multer";
import ControllerUpload from "z@Controllers/uploads/controller-upload";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";
import ENV from "z@Utils/env/utils-env";

class RouteMedia extends Route {
  private upload = multer({ dest: ENV.TEMP_DIR });
  private authMiddleware = new MiddlewareAuth();
  private uploadController = new ControllerUpload();
  private baseURI = "uploads";

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `/${this.baseURI}/`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.getAllExistingUploads
    );
    this.router.get(
      `/${this.baseURI}/public`,
      this.uploadController.getAllExistingPublicUploads
    );
    this.router.get(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.getExistingUpload
    );
    this.router.delete(
      `/${this.baseURI}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.deleteExistingUpload
    );
    this.router.get(
      `/${this.baseURI}/files/:key`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.getUploadedFile
    );
    this.router.post(
      `/${this.baseURI}/files/single`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.preserveBody,
      this.upload.single("file"),
      this.restoreBody,
      this.uploadController.uploadNewMedia
    );
    this.router.post(
      `/${this.baseURI}/files/multiple`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.preserveBody,
      this.upload.array("files", 2),
      this.restoreBody,
      this.uploadController.uploadMultipleNewMedia
    );
  }
}

export default RouteMedia;
