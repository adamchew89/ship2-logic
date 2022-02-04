import { AccessType, Account } from "z@DBs/schemas/accounts/schema-account";
import { Credential } from "z@Controllers/accounts/controller-account";

export const accounts: Account[] = [
  {
    _id: "id1",
    name: "name1",
    email: "email1",
    mobile: "mobile1",
    access: AccessType.ADMIN,
  },
  {
    _id: "id2",
    name: "name2",
    email: "email2",
    mobile: "mobile2",
    access: AccessType.NORMAL,
  },
  {
    _id: "id3",
    name: "name3",
    email: "email3",
    mobile: "mobile3",
    access: AccessType.NORMAL,
  },
];

export const credentials: Credential[] = [
  { name: "name", email: "email", mobile: "mobile1", pin: "88088808" },
];
