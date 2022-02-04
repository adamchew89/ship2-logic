import RouteMoment from "./route-moment";

describe("[RouteMoment]", () => {
  let momentRoute: RouteMoment;

  beforeEach(() => {
    momentRoute = new RouteMoment();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of RouteMoment", () => {
    expect(momentRoute).toBeDefined();
    expect(momentRoute).toBeInstanceOf(RouteMoment);
  });
});
