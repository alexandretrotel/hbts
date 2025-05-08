import type {
  FrequencyEnum,
  HabitType,
  InsertBadHabit,
  InsertGoodHabit,
  InsertGoodHabitLog,
  SelectBadHabit,
} from '@hbts/db/zod';
import { db } from '@/lib/db';
import { badHabits, goodHabits, goodHabitsLog } from '@hbts/db/schema';
import { desc, eq } from 'drizzle-orm';
import {
  DefaultMilestoneStrategy,
  type MilestoneStrategy,
} from '@hbts/common/milestones';
import { calculateProgress } from '@hbts/common/progress';

export async function insertBadHabit(data: InsertBadHabit) {
  const result = await db
    .insert(badHabits)
    .values({
      name: data.name,
      stoppedAt: data.stoppedAt,
    })
    .returning()
    .execute();
  return result;
}

export async function insertGoodHabit(data: InsertGoodHabit) {
  const result = await db
    .insert(goodHabits)
    .values({
      name: data.name,
      frequency: data.frequency,
      quantity: data.quantity,
      createdAt: data.createdAt,
    })
    .returning()
    .execute();
  return result;
}

export async function getHabits() {
  const badHabits = await getBadHabits();
  const goodHabits = await getGoodHabits();
  const allHabits = [...badHabits, ...goodHabits];
  return allHabits;
}

export async function getGoodHabits() {
  const result = await db
    .select()
    .from(goodHabits)
    .orderBy(desc(goodHabits.createdAt))
    .execute();
  return result;
}

export async function getBadHabits() {
  const result = await db
    .select()
    .from(badHabits)
    .orderBy(desc(badHabits.createdAt))
    .execute();
  return result;
}

export async function renameHabit(
  id: string,
  newName: string,
  type: HabitType
) {
  if (type === 'good') {
    const result = await db
      .update(goodHabits)
      .set({ name: newName })
      .where(eq(goodHabits.id, id))
      .returning()
      .execute();
    return result;
  } else {
    const result = await db
      .update(badHabits)
      .set({ name: newName })
      .where(eq(badHabits.id, id))
      .returning()
      .execute();
    return result;
  }
}

export async function deleteHabit(id: string, type: HabitType) {
  if (type === 'good') {
    const result = await db
      .delete(goodHabits)
      .where(eq(goodHabits.id, id))
      .returning()
      .execute();
    return result;
  } else {
    const result = await db
      .delete(badHabits)
      .where(eq(badHabits.id, id))
      .returning()
      .execute();
    return result;
  }
}

export async function collapseBadHabit(id: string) {
  const result = await db
    .update(badHabits)
    .set({ stoppedAt: new Date() })
    .where(eq(badHabits.id, id))
    .returning()
    .execute();
  return result;
}

export async function logGoodHabit(data: InsertGoodHabitLog) {
  const result = await db
    .insert(goodHabitsLog)
    .values({
      goodHabitId: data.goodHabitId,
      date: data.date,
      quantity: data.quantity,
      checked: data.checked,
    })
    .returning()
    .execute();
  return result;
}

export async function getLastLoggedGoodHabit(goodHabitId: string) {
  const habit = await db
    .select({
      date: goodHabitsLog.date,
    })
    .from(goodHabitsLog)
    .where(eq(goodHabitsLog.goodHabitId, goodHabitId))
    .orderBy(desc(goodHabitsLog.date))
    .limit(1)
    .execute();

  return habit[0]?.date || null;
}

export function getProgress(
  habits: SelectBadHabit[],
  strategy: MilestoneStrategy = new DefaultMilestoneStrategy()
) {
  return calculateProgress(habits, strategy);
}

export async function editHabit(
  id: string,
  frequency: FrequencyEnum,
  quantity: boolean
) {
  const result = await db
    .update(goodHabits)
    .set({ frequency, quantity })
    .where(eq(goodHabits.id, id))
    .returning()
    .execute();
  return result;
}
