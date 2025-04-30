import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import type { HabitRepository } from './repositories';
import { DatabaseHabitRepository } from './repositories/habits.repository';
import { setupCommand } from '@/commands/setup';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';

const homeEnvPath = path.join(os.homedir(), '.habits.env');
const localEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: [homeEnvPath, localEnvPath] });

if (!process.env.DATABASE_URL) {
  await setupCommand();
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
export const habitRepository: HabitRepository = new DatabaseHabitRepository();
