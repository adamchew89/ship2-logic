import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import * as FixtureUploads from "z@Fixtures/uploads/fixture-upload";
import * as HelperAWSS3 from "z@Helpers/aws/helper-aws-s3";
import ServiceUpload from "z@Services/uploads/service-upload";
import ControllerUpload from "./controller-upload";

jest.mock("z@Services/uploads/service-upload");
jest.mock("z@Helpers/aws/helper-aws-s3");
jest.mock("z@Utils/files/utils-file");

describe("[ControllerUpload]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let uploadController: ControllerUpload;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    uploadController = new ControllerUpload();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ControllerUpload", () => {
    expect(uploadController).toBeDefined();
    expect(uploadController).toBeInstanceOf(ControllerUpload);
  });

  describe("[getUploadedFile]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads)
        );
    });

    it("(Happy Path) should return Success OK", async () => {
      jest
        .spyOn(HelperAWSS3, "downloadFile")
        .mockImplementationOnce((id: string) =>
          Promise.resolve(new Readable())
        );
      await uploadController.getUploadedFile(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return NOT_FOUND", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementationOnce((criteria) => Promise.resolve([]));
      await uploadController.getUploadedFile(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorBase));
    });

    it("(Failure Path) should return Failure when file retrieval fails", async () => {
      jest
        .spyOn(HelperAWSS3, "downloadFile")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await uploadController.getUploadedFile(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getAllExistingPublicUploads]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads)
        );

      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        params: {},
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await uploadController.getAllExistingPublicUploads(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when uploads retrieval fails", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await uploadController.getAllExistingPublicUploads(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getAllExistingUploads]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads)
        );

      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        params: {},
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await uploadController.getAllExistingUploads(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when uploads retrieval fails", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploads")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await uploadController.getAllExistingUploads(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getExistingUpload]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploadById")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads[0])
        );

      mockReq = getMockReq({
        params: { uploadid: "uploadid" },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await uploadController.getExistingUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Happy Path) should return Success OK when uploadid is not available", async () => {
      mockReq = getMockReq({
        params: { id: "id" },
      });
      await uploadController.getExistingUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when upload retrieval fails", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploadById")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await uploadController.getExistingUpload(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[uploadNewMedia]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        file: FixtureUploads.uploads[0],
      });
      jest
        .spyOn(HelperAWSS3, "uploadFile")
        .mockImplementation((file: Upload) =>
          Promise.resolve(FixtureUploads.uploadS3Results[0])
        );
    });

    it("(Happy Path) should return Success CREATED", async () => {
      await uploadController.uploadNewMedia(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.CREATED);
    });

    it("(Failure Path) should return Failure when upload was not created successfully", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "createSingleUpload")
        .mockImplementationOnce((file: Upload) => Promise.reject(new Error()));
      await uploadController.uploadNewMedia(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[uploadMultipleNewMedia]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        files: FixtureUploads.uploads,
      });
      jest
        .spyOn(HelperAWSS3, "uploadFile")
        .mockImplementation((file: Upload) =>
          Promise.resolve(FixtureUploads.uploadS3Results[0])
        );
      jest
        .spyOn(ServiceUpload.prototype, "createMultipleUpload")
        .mockImplementation((files: Upload[]) =>
          Promise.resolve({
            uploads: FixtureUploads.uploads,
            bulkWriteResults: {},
          })
        );
    });

    it("(Happy Path) should return Success CREATED", async () => {
      await uploadController.uploadMultipleNewMedia(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.CREATED);
    });

    it("(Failure Path) should return Failure when uploads was not created successfully", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "createMultipleUpload")
        .mockImplementationOnce((files: Upload[]) =>
          Promise.reject(new Error())
        );
      await uploadController.uploadMultipleNewMedia(mockReq, mockRes, mockNext);
      expect(mockNext).toBeCalledWith(expect.any(Error));
    });
  });

  describe("[deleteExistingUpload]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceUpload.prototype, "findUploadById")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads[0])
        );
      jest
        .spyOn(HelperAWSS3, "removeFile")
        .mockImplementation((key: string) => Promise.resolve());
      jest
        .spyOn(ServiceUpload.prototype, "deleteUpload")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureUploads.uploads[0])
        );
      mockReq = getMockReq({
        params: { uploadid: "uploadid" },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await uploadController.deleteExistingUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Happy Path) should return Success OK without uploadid", async () => {
      mockReq = getMockReq({
        params: { id: "id" },
      });
      await uploadController.deleteExistingUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when uploads retrieval fails", async () => {
      jest
        .spyOn(ServiceUpload.prototype, "deleteUpload")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await uploadController.deleteExistingUpload(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
