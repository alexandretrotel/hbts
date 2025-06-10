import os from "node:os";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const homeEnvPath = path.join(os.homedir(), ".habits.env");
dotenv.config({ path: [homeEnvPath] });

const sql = neon(process.env.DATABASE_URL || "");
const db = drizzle({ client: sql, schema });

export const initDb = async (
	onError?: () => Promise<void>,
): Promise<typeof db> => {
	if (!process.env.DATABASE_URL && onError) {
		await onError();
		process.exit(0);
	}

	return db;
};
