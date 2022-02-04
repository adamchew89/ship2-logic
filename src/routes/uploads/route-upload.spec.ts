import RouteUpload from "./route-upload";

describe("[RouteUpload]", () => {
  let uploadRoute: RouteUpload;

  beforeEach(() => {
    uploadRoute = new RouteUpload();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of RouteUpload", () => {
    expect(uploadRoute).toBeDefined();
    expect(uploadRoute).toBeInstanceOf(RouteUpload);
  });
});
