import RouteAuth from "./route-auth";

describe("[RouteAuth]", () => {
  let authRoute: RouteAuth;

  beforeEach(() => {
    authRoute = new RouteAuth();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of RouteAuth", () => {
    expect(authRoute).toBeDefined();
    expect(authRoute).toBeInstanceOf(RouteAuth);
  });
});
