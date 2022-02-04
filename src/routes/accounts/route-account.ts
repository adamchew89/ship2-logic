import multer from "multer";
import ControllerAccount from "z@Controllers/accounts/controller-account";
import ControllerReply from "z@Controllers/replies/controller-reply";
import ControllerUpload from "z@Controllers/uploads/controller-upload";
import MiddlewareAuth from "z@Middlewares/auths/middleware-auth";
import Route from "z@Routes/route";

class RouteAccount extends Route {
  private upload = multer({ dest: ".temp/uploads" });
  private authMiddleware = new MiddlewareAuth();
  private accountController = new ControllerAccount();
  private uploadController = new ControllerUpload();
  private replyController = new ControllerReply();
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
    this.router.get(
      `/${this.baseURI}/:id/reply`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.replyController.getExistingReplyByAccountId
    );
    this.router.patch(
      `/${this.baseURI}/:id/reply`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.replyController.updateExistingReplyByAccountId
    );
    this.router.get(
      `/${this.baseURI}/:id/uploads`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.getAllExistingUploads
    );
    this.router.post(
      `/${this.baseURI}/:id/uploads`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.preserveBody,
      this.upload.single("file"),
      this.restoreBody,
      this.uploadController.uploadNewMedia
    );
    this.router.get(
      `/${this.baseURI}/:id/uploads/:uploadid`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.getExistingUpload
    );
    this.router.delete(
      `/${this.baseURI}/:id/uploads/:uploadid`,
      this.authMiddleware.authenticate,
      this.authMiddleware.isUserAuthorized,
      this.uploadController.deleteExistingUpload
    );
  }
}

export default RouteAccount;
