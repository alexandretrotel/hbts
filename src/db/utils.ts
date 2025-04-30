import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { habits } from "./schema";
import type { InsertHabit } from "./zod";

export async function insertHabit(data: InsertHabit) {
  return db
    .insert(habits)
    .values({
      name: data.name,
      stoppedAt: data.stoppedAt,
    })
    .returning();
}

export async function getHabits() {
  return db.select().from(habits).orderBy(desc(habits.createdAt));
}

export async function renameHabit(id: string, newName: string) {
  return db
    .update(habits)
    .set({ name: newName })
    .where(eq(habits.id, id))
    .returning();
}

export async function deleteHabit(id: string) {
  return db.delete(habits).where(eq(habits.id, id)).returning();
}

export async function collapseHabit(id: string) {
  return db
    .update(habits)
    .set({ stoppedAt: new Date() })
    .where(eq(habits.id, id))
    .returning();
}
