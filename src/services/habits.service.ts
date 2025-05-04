import type {
  FrequencyEnum,
  HabitType,
  InsertBadHabit,
  InsertGoodHabit,
  InsertGoodHabitLog,
  SelectBadHabit,
  SelectGoodHabit,
  SelectGoodHabitLog,
  SelectHabit,
} from '@/db/zod';
import { db } from '@/db';
import { badHabits, goodHabits, goodHabitsLog } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import {
  DefaultMilestoneStrategy,
  type MilestoneStrategy,
} from '@/utils/milestones';
import { calculateProgress } from '@/utils/progress';

export async function insertBadHabit(
  data: InsertBadHabit
): Promise<SelectBadHabit[]> {
  return db
    .insert(badHabits)
    .values({
      name: data.name,
      stoppedAt: data.stoppedAt,
    })
    .returning();
}

export async function insertGoodHabit(
  data: InsertGoodHabit
): Promise<SelectGoodHabit[]> {
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

export async function getHabits(): Promise<SelectHabit[]> {
  const badHabits = await getBadHabits();
  const goodHabits = await getGoodHabits();
  const allHabits = [...badHabits, ...goodHabits];
  return allHabits;
}

export async function getGoodHabits(): Promise<SelectGoodHabit[]> {
  return db.select().from(goodHabits).orderBy(desc(goodHabits.createdAt));
}

export async function getBadHabits(): Promise<SelectBadHabit[]> {
  return db.select().from(badHabits).orderBy(desc(badHabits.createdAt));
}

export async function renameHabit(
  id: string,
  newName: string,
  type: HabitType
): Promise<SelectHabit[]> {
  if (type === 'good') {
    return db
      .update(goodHabits)
      .set({ name: newName })
      .where(eq(goodHabits.id, id))
      .returning();
  } else {
    return db
      .update(badHabits)
      .set({ name: newName })
      .where(eq(badHabits.id, id))
      .returning();
  }
}

export async function deleteHabit(
  id: string,
  type: HabitType
): Promise<SelectHabit[]> {
  if (type === 'good') {
    return db.delete(goodHabits).where(eq(goodHabits.id, id)).returning();
  } else {
    return db.delete(badHabits).where(eq(badHabits.id, id)).returning();
  }
}

export async function collapseBadHabit(id: string): Promise<SelectBadHabit[]> {
  return db
    .update(badHabits)
    .set({ stoppedAt: new Date() })
    .where(eq(badHabits.id, id))
    .returning();
}

export async function logGoodHabit(
  data: InsertGoodHabitLog
): Promise<SelectGoodHabitLog[]> {
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

export async function getLastLoggedGoodHabit(
  goodHabitId: string
): Promise<Date> {
  const habit = await db
    .select({
      date: goodHabitsLog.date,
    })
    .from(goodHabitsLog)
    .where(eq(goodHabitsLog.goodHabitId, goodHabitId))
    .orderBy(desc(goodHabitsLog.date))
    .limit(1);

  if (!habit[0]) {
    throw new Error('No logged habit found');
  }

  return habit[0].date;
}

export async function getProgress(
  habits: SelectHabit[],
  strategy: MilestoneStrategy = new DefaultMilestoneStrategy()
): Promise<{ percentage: number; level: number }> {
  return calculateProgress(habits, strategy);
}

export async function editHabit(
  id: string,
  frequency: FrequencyEnum,
  quantity: boolean
): Promise<SelectGoodHabit[]> {
  return db
    .update(goodHabits)
    .set({ frequency, quantity })
    .where(eq(goodHabits.id, id))
    .returning();
}
