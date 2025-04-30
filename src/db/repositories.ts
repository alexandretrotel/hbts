import type { SelectHabit, InsertHabit } from '@/db/zod';

export interface HabitRepository {
  insertHabit(data: InsertHabit): Promise<SelectHabit[]>;
  getHabits(): Promise<SelectHabit[]>;
  renameHabit(id: string, newName: string): Promise<SelectHabit[]>;
  deleteHabit(id: string): Promise<SelectHabit[]>;
  collapseHabit(id: string): Promise<SelectHabit[]>;
}
