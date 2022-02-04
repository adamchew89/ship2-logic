import RouteReply from "./route-reply";

describe("[RouteReply]", () => {
  let replyRoute: RouteReply;

  beforeEach(() => {
    replyRoute = new RouteReply();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of RouteReply", () => {
    expect(replyRoute).toBeDefined();
    expect(replyRoute).toBeInstanceOf(RouteReply);
  });
});
