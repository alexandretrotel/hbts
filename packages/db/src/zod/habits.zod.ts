import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";
import * as schema from "../schema/index";

export const selectBadHabitSchema = createSelectSchema(schema.badHabits);
export const insertBadHabitSchema = createInsertSchema(schema.badHabits);
export type SelectBadHabit = z.infer<typeof selectBadHabitSchema>;
export type InsertBadHabit = z.infer<typeof insertBadHabitSchema>;

export const selectGoodHabitSchema = createSelectSchema(schema.goodHabits);
export const insertGoodHabitSchema = createInsertSchema(schema.goodHabits);
export type SelectGoodHabit = z.infer<typeof selectGoodHabitSchema>;
export type InsertGoodHabit = z.infer<typeof insertGoodHabitSchema>;

export const frequencyEnumSchema = createSelectSchema(schema.frequencyEnum);
export type FrequencyEnum = z.infer<typeof frequencyEnumSchema>;

export const selectGoodHabitsLogSchema = createSelectSchema(
	schema.goodHabitsLog,
);
export const insertGoodHabitLogSchema = createInsertSchema(
	schema.goodHabitsLog,
);
export type SelectGoodHabitLog = z.infer<typeof selectGoodHabitsLogSchema>;
export type InsertGoodHabitLog = z.infer<typeof insertGoodHabitLogSchema>;

export type SelectHabit = SelectBadHabit | SelectGoodHabit;
export type InsertHabit = InsertBadHabit | InsertGoodHabit;

export type HabitType = "bad" | "good";
