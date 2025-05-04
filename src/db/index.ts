import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { setupCommand } from '@/commands/setup';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';

const homeEnvPath = path.join(os.homedir(), '.habits.env');
dotenv.config({ path: [homeEnvPath] });

if (!process.env.DATABASE_URL) {
  await setupCommand();
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
