import { model, Schema } from "mongoose";

export interface Upload {
  _id: string;
  account: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: MimeType;
  destination: string;
  filename: string;
  path: string;
  size: number;
  key: string;
  bucket: string;
  uri: string;
  isPublic?: boolean;
}

export enum MimeType {
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
}

const SchemaUpload = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: {
    type: String,
    enum: MimeType,
    required: true,
  },
  destination: String,
  filename: String,
  path: String,
  size: Number,
  key: String,
  bucket: String,
  uri: String,
  isPublic: { type: Schema.Types.Boolean, default: false },
});

export const ModelUpload = model("Upload", SchemaUpload);

export default SchemaUpload;
