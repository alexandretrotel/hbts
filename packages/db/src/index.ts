import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";
import os from "os";
import path from "path";

const homeEnvPath = path.join(os.homedir(), ".habits.env");
dotenv.config({ path: [homeEnvPath] });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

export const initDb = async (
  onError: () => Promise<void>
): Promise<typeof db> => {
  if (!process.env.DATABASE_URL) {
    await onError();
    process.exit(0);
  }

  return db;
};
