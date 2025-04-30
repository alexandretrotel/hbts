import type { z } from "zod";
import * as schema from "../schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

// habits table
export const selectHabitSchema = createSelectSchema(schema.habits);
export const insertHabitSchema = createInsertSchema(schema.habits);

export type SelectHabit = z.infer<typeof selectHabitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

// habit logs table
export const selectHabitLogSchema = createSelectSchema(schema.habitLogs);
export const insertHabitLogSchema = createInsertSchema(schema.habitLogs);

export type SelectHabitLog = z.infer<typeof selectHabitLogSchema>;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;

// user progress table
export const selectUserProgressSchema = createSelectSchema(schema.userProgress);
export const insertUserProgressSchema = createInsertSchema(schema.userProgress);

export type SelectUserProgress = z.infer<typeof selectUserProgressSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
