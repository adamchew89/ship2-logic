import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import * as Database from "z@DBs/db";
import { errorHandler } from "z@Errors/error-base";
import Route from "z@Routes/route";
import middlewareLogs from "z@Middlewares/loggers/middleware-logger";

class Server {
  public app: Express;

  constructor(routes: Route[] = []) {
    this.app = express();
    this.setupMiddlewares();
    this.setupDatabase();
    this.setupRoutes(routes);
    this.initializeErrorHandler();
  }

  private setupMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(middlewareLogs);
  }

  private setupRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(errorHandler);
  }

  private async setupDatabase() {
    await Database.connect();
  }

  public listen(port: number, cb: () => void) {
    this.app.listen(port, cb);
  }
}

export default Server;
