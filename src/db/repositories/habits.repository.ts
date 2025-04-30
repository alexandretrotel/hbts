import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { badHabits } from '@/db/schema';
import type { HabitRepository } from '@/db/repositories';
import type { InsertHabit, SelectHabit } from '@/db/zod';

export class DatabaseHabitRepository implements HabitRepository {
  async insertHabit(data: InsertHabit): Promise<SelectHabit[]> {
    return db
      .insert(badHabits)
      .values({
        name: data.name,
        stoppedAt: data.stoppedAt,
      })
      .returning();
  }

  async getHabits(): Promise<SelectHabit[]> {
    return db.select().from(badHabits).orderBy(desc(badHabits.createdAt));
  }

  async renameHabit(id: string, newName: string): Promise<SelectHabit[]> {
    return db
      .update(badHabits)
      .set({ name: newName })
      .where(eq(badHabits.id, id))
      .returning();
  }

  async deleteHabit(id: string): Promise<SelectHabit[]> {
    return db.delete(badHabits).where(eq(badHabits.id, id)).returning();
  }

  async collapseHabit(id: string): Promise<SelectHabit[]> {
    return db
      .update(badHabits)
      .set({ stoppedAt: new Date() })
      .where(eq(badHabits.id, id))
      .returning();
  }
}
