import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";
import os from "os";
import path from "path";

const homeEnvPath = path.join(os.homedir(), ".habits.env");
dotenv.config({ path: [homeEnvPath] });

export const initDb = async (onError: () => Promise<void>) => {
  if (!process.env.DATABASE_URL) {
    await onError();
    process.exit(0);
  }

  const sql = neon(process.env.DATABASE_URL!);
  return drizzle({ client: sql, schema });
};
