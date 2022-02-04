import * as FixtureRoute from "z@Fixtures/routes/fixture-route";
import Server from "./server";

jest.mock("z@DBs/db");

describe("[Server]", () => {
  let server: Server;

  beforeEach(() => {
    server = new Server();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of Server without routes", () => {
    expect(server).toBeDefined();
    expect(server).toBeInstanceOf(Server);
  });

  it("should create an instance of Server with routes", () => {
    server = new Server(FixtureRoute.AllRoutes);
    expect(server).toBeDefined();
    expect(server).toBeInstanceOf(Server);
  });
});
