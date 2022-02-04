import { ModelMoment } from "z@DBs/schemas/moments/schema-moment";
import ErrorBase from "z@Errors/error-base";
import * as FixtureMoments from "z@Fixtures/moments/fixture-moment";
import ServiceMoment from "./service-moment";

jest.mock("z@DBs/schemas/moments/schema-moment");

describe("[ServiceMoment]", () => {
  let momentService: ServiceMoment;

  beforeEach(() => {
    momentService = new ServiceMoment();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ServiceMoment", () => {
    expect(momentService).toBeDefined();
    expect(momentService).toBeInstanceOf(ServiceMoment);
  });

  describe("[findMoments]", () => {
    it("(Happy Path) should return Moment[] when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelMoment, "find")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(() => ({
              populate: mockPopulate.mockImplementationOnce(
                jest.fn().mockResolvedValueOnce([FixtureMoments.moments[0]])
              ),
            })),
          }))
        );
      const response = await momentService.findMoments();
      expect(response).toMatchObject(FixtureMoments.moments);
    });
  });

  describe("[findMomentById]", () => {
    it("(Happy Path) should return Moment when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelMoment, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(() => ({
              populate: mockPopulate.mockImplementationOnce(
                jest.fn().mockResolvedValueOnce(FixtureMoments.moments[0])
              ),
            })),
          }))
        );
      const response = await momentService.findMomentById(
        FixtureMoments.moments[0]._id
      );
      expect(response).toMatchObject(FixtureMoments.moments[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelMoment, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(() => ({
              populate: mockPopulate.mockImplementationOnce(
                jest.fn().mockResolvedValueOnce(undefined)
              ),
            })),
          }))
        );
      try {
        await momentService.findMomentById(FixtureMoments.moments[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });

  describe("[createSingleMoment]", () => {
    it("(Happy Path) should return Moment when called", async () => {
      jest
        .spyOn(ModelMoment.prototype, "save")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureMoments.moments[0])
        );
      const response = await momentService.createMoment(
        FixtureMoments.moments[0]
      );
      expect(response).toMatchObject(FixtureMoments.moments[0]);
    });
  });

  describe("[deleteMoment]", () => {
    it("(Happy Path) should return Moment when called", async () => {
      jest
        .spyOn(ModelMoment, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve({ ...FixtureMoments.moments[0], remove: jest.fn() })
        );
      expect(
        await momentService.deleteMoment(FixtureMoments.moments[0]._id)
      ).toMatchObject(FixtureMoments.moments[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(ModelMoment, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await momentService.deleteMoment(FixtureMoments.moments[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });
});
