import { AccessType, Account } from "z@DBs/schemas/accounts/schema-account";
import { Credential } from "z@Controllers/accounts/controller-account";

export const accounts: Account[] = [
  {
    _id: 1,
    name: "name1",
    mobile: "mobile1",
    access: AccessType.ADMIN,
  },
  {
    _id: 2,
    name: "name2",
    mobile: "mobile2",
    access: AccessType.NORMAL,
  },
  {
    _id: 3,
    name: "name3",
    mobile: "mobile3",
    access: AccessType.NORMAL,
  },
];

export const credentials: Credential[] = [
  { name: "name", mobile: "mobile1", pin: "88088808" },
];
