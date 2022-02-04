import RouteAccount from "./route-account";

describe("[RouteAccount]", () => {
  let accountRoute: RouteAccount;

  beforeEach(() => {
    accountRoute = new RouteAccount();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of RouteAccount", () => {
    expect(accountRoute).toBeDefined();
    expect(accountRoute).toBeInstanceOf(RouteAccount);
  });
});
