import { ModelUpload } from "z@DBs/schemas/uploads/schema-upload";
import ErrorBase from "z@Errors/error-base";
import * as FixtureUpload from "z@Fixtures/uploads/fixture-upload";
import ServiceUpload from "./service-upload";

jest.mock("z@DBs/schemas/uploads/schema-upload");

describe("[ServiceUpload]", () => {
  let uploadService: ServiceUpload;

  beforeEach(() => {
    uploadService = new ServiceUpload();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ServiceUpload", () => {
    expect(uploadService).toBeDefined();
    expect(uploadService).toBeInstanceOf(ServiceUpload);
  });

  describe("[findUploads]", () => {
    it("(Happy Path) should return Upload[] when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelUpload, "find")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(
              () => FixtureUpload.uploads
            ),
          }))
        );
      const response = await uploadService.findUploads();
      expect(response).toMatchObject(FixtureUpload.uploads);
    });
  });

  describe("[findUploadById]", () => {
    it("(Happy Path) should return Upload when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelUpload, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(() =>
              Promise.resolve(FixtureUpload.uploads[0])
            ),
          }))
        );
      const response = await uploadService.findUploadById(
        FixtureUpload.uploads[0]._id
      );
      expect(response).toMatchObject(FixtureUpload.uploads[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelUpload, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(() => undefined),
          }))
        );
      try {
        await uploadService.findUploadById(FixtureUpload.uploads[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });

  describe("[createSingleUpload]", () => {
    it("(Happy Path) should return Upload when called", async () => {
      jest
        .spyOn(ModelUpload.prototype, "save")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureUpload.uploads[0])
        );
      const response = await uploadService.createSingleUpload(
        FixtureUpload.uploads[0]
      );
      expect(response).toMatchObject(FixtureUpload.uploads[0]);
    });
  });

  describe("[createMultipleUpload]", () => {
    it("(Happy Path) should return Upload[] when called", async () => {
      jest
        .spyOn(ModelUpload, "bulkSave")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) => Promise.resolve({}));
      const response = await uploadService.createMultipleUpload(
        FixtureUpload.uploads
      );
      expect(response.uploads).toBeInstanceOf(Array);
      response.uploads.forEach((upload) => {
        expect(upload).toBeInstanceOf(ModelUpload);
      });
    });
  });

  describe("[deleteUpload]", () => {
    it("(Happy Path) should return Upload when called", async () => {
      jest
        .spyOn(ModelUpload, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve({ ...FixtureUpload.uploads[0], remove: jest.fn() })
        );
      expect(
        await uploadService.deleteUpload(FixtureUpload.uploads[0]._id)
      ).toMatchObject(FixtureUpload.uploads[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(ModelUpload, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await uploadService.deleteUpload(FixtureUpload.uploads[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });
});
