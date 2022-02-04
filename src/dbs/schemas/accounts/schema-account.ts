import { model, Schema } from "mongoose";

export interface Account {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  access?: AccessType;
  hash?: string;
  token?: string;
}

export enum AccessType {
  ADMIN = "admin",
  NORMAL = "normal",
}

const SchemaAccount = new Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  mobile: String,
  access: {
    type: String,
    enum: AccessType,
    select: false,
    required: false,
    default: AccessType.NORMAL,
  },
  hash: {
    type: String,
    select: false,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
});

export const ModelAccount = model("Account", SchemaAccount);

export default SchemaAccount;
