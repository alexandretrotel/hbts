import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { badHabits, goodHabits, goodHabitsLog } from '@/db/schema';
import type { HabitRepository } from '@/db/repositories';
import type {
  InsertBadHabit,
  InsertGoodHabit,
  InsertGoodHabitLog,
  SelectBadHabit,
  SelectGoodHabit,
  SelectGoodHabitLog,
  SelectHabit,
} from '@/db/zod';

export class DatabaseHabitRepository implements HabitRepository {
  async insertBadHabit(data: InsertBadHabit): Promise<SelectBadHabit[]> {
    return db
      .insert(badHabits)
      .values({
        name: data.name,
        stoppedAt: data.stoppedAt,
      })
      .returning();
  }

  async insertGoodHabit(data: InsertGoodHabit): Promise<SelectGoodHabit[]> {
    return db
      .insert(goodHabits)
      .values({
        name: data.name,
        frequency: data.frequency,
        quantity: data.quantity,
        createdAt: data.createdAt,
      })
      .returning();
  }

  async getHabits(): Promise<SelectHabit[]> {
    return db.select().from(badHabits).orderBy(desc(badHabits.createdAt));
  }

  async getGoodHabits(): Promise<SelectGoodHabit[]> {
    return db.select().from(goodHabits).orderBy(desc(goodHabits.createdAt));
  }

  async getBadHabits(): Promise<SelectBadHabit[]> {
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

  async collapseBadHabit(id: string): Promise<SelectBadHabit[]> {
    return db
      .update(badHabits)
      .set({ stoppedAt: new Date() })
      .where(eq(badHabits.id, id))
      .returning();
  }

  async logGoodHabit(data: InsertGoodHabitLog): Promise<SelectGoodHabitLog[]> {
    return db
      .insert(goodHabitsLog)
      .values({
        goodHabitId: data.goodHabitId,
        date: data.date,
        quantity: data.quantity,
        checked: data.checked,
      })
      .returning();
  }
}
