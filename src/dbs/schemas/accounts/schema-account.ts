import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum AccessType {
  ADMIN = "admin",
  NORMAL = "normal",
}
export interface Account {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  access?: AccessType;
  hash?: string;
  token?: string;
}

@Entity("Account")
class SchemaAccount {
  @PrimaryGeneratedColumn({ name: "_id" })
  _id!: number;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "mobile" })
  mobile!: string;

  @Column({
    name: "access",
    type: "simple-enum",
    enum: AccessType,
    default: AccessType.NORMAL,
  })
  access?: AccessType;

  @Column({ name: "hash" })
  hash?: string;

  @Column({ name: "token" })
  token?: string;
}

export default SchemaAccount;
