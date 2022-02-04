import S3 from "aws-sdk/clients/s3";
import { MimeType, Upload } from "z@DBs/schemas/uploads/schema-upload";

export const uploads: Upload[] = [
  {
    _id: "_id",
    account: "account",
    fieldname: "fieldname",
    originalname: "originalname",
    encoding: "encoding",
    mimetype: MimeType.PNG,
    destination: "destination",
    filename: "filename",
    path: "path",
    size: 123456,
    key: "key",
    bucket: "bucket",
    uri: "uri",
  },
];

export const uploadS3Results: S3.ManagedUpload.SendData[] = [
  {
    Key: "Key",
    Bucket: "Bucket",
    Location: "Location",
    ETag: "ETag",
  },
];
