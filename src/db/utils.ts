import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { badHabits } from './schema';
import type { InsertHabit } from './zod';

export async function insertHabit(data: InsertHabit) {
  return db
    .insert(badHabits)
    .values({
      name: data.name,
      stoppedAt: data.stoppedAt,
    })
    .returning();
}

export async function getHabits() {
  return db.select().from(badHabits).orderBy(desc(badHabits.createdAt));
}

export async function renameHabit(id: string, newName: string) {
  return db
    .update(badHabits)
    .set({ name: newName })
    .where(eq(badHabits.id, id))
    .returning();
}

export async function deleteHabit(id: string) {
  return db.delete(badHabits).where(eq(badHabits.id, id)).returning();
}

export async function collapseHabit(id: string) {
  return db
    .update(badHabits)
    .set({ stoppedAt: new Date() })
    .where(eq(badHabits.id, id))
    .returning();
}
