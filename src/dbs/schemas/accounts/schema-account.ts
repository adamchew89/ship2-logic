import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AccessType {
  ADMIN = "admin",
  NORMAL = "normal",
}
export interface Account {
  _id: number;
  name: string;
  mobile: string;
  access: AccessType;
  hash?: string;
  token?: string;
}

@Entity("accounts")
class ModelAccount extends BaseEntity {
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
  access!: AccessType;

  @Column({ name: "hash", nullable: true })
  hash?: string;

  @Column({ name: "token", nullable: true })
  token?: string;
}

export default ModelAccount;
