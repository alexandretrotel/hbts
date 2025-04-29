import type { z } from "zod";
import * as schema from "../schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

// habits table
export const selectHabitSchema = createSelectSchema(schema.habits);
export const insertHabitSchema = createInsertSchema(schema.habits);

export type SelectHabit = z.infer<typeof selectHabitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
