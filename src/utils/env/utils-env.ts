import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

const ENV = cleanEnv(process.env, {
  // Environment
  NODE_ENV: str({ choices: ["development", "test", "staging", "production"] }),
  // Databases
  DB_HOST: str(),
  // Security
  JWT_SECRET: str(),
  BCRYPT_SALT_ROUNDS: num(),
});

export default ENV;
