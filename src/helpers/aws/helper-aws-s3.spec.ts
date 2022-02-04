import { Readable } from "stream";
import * as FixtureUploads from "z@Fixtures/uploads/fixture-upload";
import * as HelperAWSS3 from "z@Helpers/aws/helper-aws-s3";

jest.mock("fs");
jest.mock("aws-sdk/clients/s3", () =>
  jest.fn().mockImplementation(() => ({
    upload: () => ({
      promise: () => Promise.resolve(FixtureUploads.uploadS3Results[0]),
    }),
    getObject: () => ({ createReadStream: () => new Readable() }),
    deleteObject: () => ({ promise: () => Promise.resolve() }),
  }))
);
jest.mock("z@Utils/env/utils-env", () =>
  jest.fn().mockImplementation(() => ({}))
);

describe("[HelperAWSS3]", () => {
  describe("[uploadFile]", () => {
    it("should return S3.ManagedUpload.SendData", async () => {
      expect(await HelperAWSS3.uploadFile(FixtureUploads.uploads[0])).toBe(
        FixtureUploads.uploadS3Results[0]
      );
    });
  });

  describe("[downloadFile]", () => {
    it("should return Readable", async () => {
      expect(
        await HelperAWSS3.downloadFile(FixtureUploads.uploads[0].key)
      ).toBeInstanceOf(Readable);
    });
  });

  describe("[removeFile]", () => {
    it("should return void", async () => {
      expect(
        await HelperAWSS3.removeFile(FixtureUploads.uploads[0].key)
      ).toBeUndefined();
    });
  });
});
