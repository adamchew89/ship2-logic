import Route from "z@Routes/route";

class RouteFixture extends Route {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/fixture", jest.fn());
  }
}

export const AllRoutes = [new RouteFixture()];
