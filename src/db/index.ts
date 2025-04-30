import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import type { HabitRepository } from './repositories';
import { DatabaseHabitRepository } from './repositories/habits.repository';
import { setupCommand } from '@/commands/setup';

if (!process.env.DATABASE_URL) {
  await setupCommand();
  console.log('Please restart the application after setting up the database.');
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
export const habitRepository: HabitRepository = new DatabaseHabitRepository();
