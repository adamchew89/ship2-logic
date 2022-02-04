import { Reply, DietTypes } from "z@DBs/schemas/replies/schema-reply";

export const replies: Reply[] = [
  {
    _id: "_id",
    account: "account",
    isAttending: true,
    diet: DietTypes.NON_MUSLIM,
    remarks: "remarks",
  },
  {
    _id: "_id2",
    account: "account",
    isAttending: false,
  },
];
