import Route from "./route";
import AllRoutes from "./route-root";

describe("[AllRoutes]", () => {
  it("should contain Route[]", () => {
    expect(AllRoutes).toBeInstanceOf(Array);
    AllRoutes.forEach((route) => {
      expect(route).toBeInstanceOf(Route);
    });
  });
});
