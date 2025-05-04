import type {
  SelectBadHabit,
  InsertBadHabit,
  InsertGoodHabit,
  SelectGoodHabit,
  SelectHabit,
} from '@/db/zod';

export interface HabitRepository {
  insertBadHabit(data: InsertBadHabit): Promise<SelectBadHabit[]>;
  insertGoodHabit(data: InsertGoodHabit): Promise<SelectGoodHabit[]>;
  getHabits(): Promise<SelectHabit[]>;
  renameHabit(id: string, newName: string): Promise<SelectHabit[]>;
  deleteHabit(id: string): Promise<SelectHabit[]>;
  collapseBadHabit(id: string): Promise<SelectBadHabit[]>;
}
