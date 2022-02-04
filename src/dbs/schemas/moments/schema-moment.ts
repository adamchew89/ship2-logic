import { model, Schema } from "mongoose";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import { Account } from "z@DBs/schemas/accounts/schema-account";

export interface Moment {
  _id: string;
  account: string | Account;
  uploads?: string[] | Upload[];
  sentiment?: string;
}

const SchemaMoment = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  uploads: [{ type: Schema.Types.ObjectId, ref: "Upload" }],
  sentiment: { type: String },
});

export const ModelMoment = model("Moment", SchemaMoment);

export default SchemaMoment;
