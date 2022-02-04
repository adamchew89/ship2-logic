import dotenv from "dotenv";
import { cleanEnv, num, str, url } from "envalid";

dotenv.config();

const ENV = cleanEnv(process.env, {
  // Environment
  NODE_ENV: str({ choices: ["development", "test", "staging", "production"] }),
  // Databases
  DB_HOST: url(),
  // Security
  JWT_SECRET: str(),
  BCRYPT_SALT_ROUNDS: num(),
  // Temp
  TEMP_DIR: str(),
  // AWS
  AWS_REGION: str(),
  // AWS - S3
  AWS_S3_BUCKET_ACCESS_KEY_ID: str(),
  AWS_S3_BUCKET_SECRET_ACCESS_KEY: str(),
  AWS_S3_BUCKET_NAME: str(),
});

export default ENV;
