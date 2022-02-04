import { model, Schema } from "mongoose";

export interface Reply {
  _id: string;
  account: string;
  isAttending: boolean;
  diet?: DietTypes;
  remarks?: string;
}

export enum DietTypes {
  VEGETARIAN = "vegetarian",
  MUSLIM = "muslim",
  NON_MUSLIM = "non-muslim",
  OTHERS = "others",
}

const SchemaReply = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  isAttending: Boolean,
  diet: {
    type: String,
    enum: DietTypes,
    select: false,
    required: false,
    default: DietTypes.NON_MUSLIM,
  },
  remarks: { type: String, maxLength: 161, required: false },
});

export const ModelReply = model("Reply", SchemaReply);

export default SchemaReply;
