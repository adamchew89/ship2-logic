import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import { Readable } from "stream";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import ENV from "z@Utils/env/utils-env";

const s3 = new S3({
  region: ENV.AWS_REGION,
  accessKeyId: ENV.AWS_S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: ENV.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
});

export async function uploadFile(
  upload: Upload
): Promise<S3.ManagedUpload.SendData> {
  const uploadStream = fs.createReadStream(upload.path);
  const uploadParams = {
    Bucket: ENV.AWS_S3_BUCKET_NAME,
    Body: uploadStream,
    Key: upload.filename,
  };
  return await s3.upload(uploadParams).promise();
}

export async function downloadFile(uploadKey: string): Promise<Readable> {
  const downloadParams = {
    Key: uploadKey,
    Bucket: ENV.AWS_S3_BUCKET_NAME,
  };
  return s3.getObject(downloadParams).createReadStream();
}

export async function removeFile(uploadKey: string): Promise<void> {
  const deleteParams = {
    Key: uploadKey,
    Bucket: ENV.AWS_S3_BUCKET_NAME,
  };
  await s3.deleteObject(deleteParams).promise();
}
