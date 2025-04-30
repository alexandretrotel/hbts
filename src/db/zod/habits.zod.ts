import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import * as schema from '@/db/schema';

export const selectHabitSchema = createSelectSchema(schema.badHabits);
export const insertHabitSchema = createInsertSchema(schema.badHabits);

export type SelectHabit = z.infer<typeof selectHabitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
