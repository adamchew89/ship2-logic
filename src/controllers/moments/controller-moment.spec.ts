import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import { Moment } from "z@DBs/schemas/moments/schema-moment";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import * as FixtureMoments from "z@Fixtures/moments/fixture-moment";
import * as FixtureUploads from "z@Fixtures/uploads/fixture-upload";
import * as HelperAWSS3 from "z@Helpers/aws/helper-aws-s3";
import ServiceMoment from "z@Services/moments/service-moment";
import ServiceUpload from "z@Services/uploads/service-upload";
import ControllerMoment from "./controller-moment";

jest.mock("z@Services/uploads/service-upload");
jest.mock("z@Services/moments/service-moment");
jest.mock("z@Helpers/aws/helper-aws-s3");
jest.mock("z@Utils/files/utils-file");

describe("[ControllerMoment]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let momentController: ControllerMoment;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    momentController = new ControllerMoment();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ControllerMoment", () => {
    expect(momentController).toBeDefined();
    expect(momentController).toBeInstanceOf(ControllerMoment);
  });

  describe("[getAllExistingMoments]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceMoment.prototype, "findMoments")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureMoments.moments)
        );

      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        params: {},
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await momentController.getAllExistingMoments(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when moments retrieval fails", async () => {
      jest
        .spyOn(ServiceMoment.prototype, "findMoments")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await momentController.getAllExistingMoments(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getExistingMoment]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceMoment.prototype, "findMomentById")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureMoments.moments[0])
        );

      mockReq = getMockReq({
        params: { id: "id" },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await momentController.getExistingMoment(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when moment retrieval fails", async () => {
      jest
        .spyOn(ServiceMoment.prototype, "findMomentById")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await momentController.getExistingMoment(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[createNewMoment]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        files: FixtureUploads.uploads,
        sentiment: FixtureMoments.moments[0].sentiment,
      });
      jest
        .spyOn(HelperAWSS3, "uploadFile")
        .mockImplementation((file: Upload) =>
          Promise.resolve(FixtureUploads.uploadS3Results[0])
        );
      jest
        .spyOn(ServiceUpload.prototype, "createMultipleUpload")
        .mockImplementation((uploads: Upload[]) =>
          Promise.resolve({ uploads, bulkWriteResults: {} })
        );
      jest
        .spyOn(ServiceMoment.prototype, "createMoment")
        .mockImplementation((moment: Moment) =>
          Promise.resolve(FixtureMoments.moments[0])
        );
    });

    it("(Happy Path) should return Success CREATED", async () => {
      await momentController.createNewMoment(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.CREATED);
    });

    it("(Failure Path) should return Failure when uploads was not created successfully", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "createMultipleUpload")
        .mockImplementationOnce((uploads: Upload[]) =>
          Promise.reject(new Error())
        );
      await momentController.createNewMoment(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[deleteExistingUpload]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceMoment.prototype, "findMomentById")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureMoments.moments[0])
        );
      jest
        .spyOn(HelperAWSS3, "removeFile")
        .mockImplementation((key: string) => Promise.resolve());
      jest
        .spyOn(ServiceMoment.prototype, "deleteMoment")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureMoments.moments[0])
        );
      mockReq = getMockReq({
        params: { id: "id" },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await momentController.deleteExistingMoment(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when moments retrieval fails", async () => {
      jest
        .spyOn(ServiceMoment.prototype, "deleteMoment")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await momentController.deleteExistingMoment(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
