import { desc } from "drizzle-orm";
import { db } from "./index";
import { habits } from "./schema";
import type { InsertHabit } from "./zod";

export async function insertHabit(data: InsertHabit) {
  return db
    .insert(habits)
    .values({
      name: data.name,
      startedAt: data.startedAt,
    })
    .returning();
}

export async function getHabits() {
  return db.select().from(habits).orderBy(desc(habits.createdAt));
}
