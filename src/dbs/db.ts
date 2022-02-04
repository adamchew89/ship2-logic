import mongoose from "mongoose";
import ENV from "z@Utils/env/utils-env";

export async function connect() {
  try {
    await mongoose.connect(ENV.DB_HOST!);
  } catch (error) {
    throw error;
  }
}
