import { Connection, createConnection } from "typeorm";
import ENV from "z@Utils/env/utils-env";
import SchemaAccount from "./schemas/accounts/schema-account";

export async function connect(): Promise<void> {
  try {
    const connection: Connection = await createConnection({
      name: "default",
      type: "sqlite",
      database: ENV.DB_HOST!,
      entities: [SchemaAccount],
      synchronize: true,
    });
    console.log({ connection });
  } catch (error) {
    throw error;
  }
}
