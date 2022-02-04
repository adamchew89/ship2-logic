import { server } from "./app";

jest.mock("z@Servers/server", () =>
  jest.fn().mockImplementation(() => ({
    listen: jest.fn().mockImplementation((port: number, cb: any) => {
      cb();
    }),
  }))
);

describe("[App]", () => {
  it("should return a defined server", () => {
    expect(server).toBeDefined();
  });
});
