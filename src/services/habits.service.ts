import type { HabitRepository } from '@/db/repositories';
import { calculateProgress } from '@/utils/progress';
import {
  DefaultMilestoneStrategy,
  type MilestoneStrategy,
} from '@/utils/milestones';
import type {
  InsertBadHabit,
  InsertGoodHabit,
  SelectBadHabit,
  SelectGoodHabit,
  SelectHabit,
} from '@/db/zod';

export class HabitService {
  constructor(private repository: HabitRepository) {}

  async addBadHabit(habit: InsertBadHabit): Promise<SelectBadHabit[]> {
    return this.repository.insertBadHabit(habit);
  }

  async addGoodHabit(habit: InsertGoodHabit): Promise<SelectGoodHabit[]> {
    return this.repository.insertGoodHabit(habit);
  }

  async getHabits(): Promise<SelectHabit[]> {
    return this.repository.getHabits();
  }

  async renameHabit(id: string, newName: string): Promise<SelectHabit[]> {
    return this.repository.renameHabit(id, newName);
  }

  async deleteHabit(id: string): Promise<SelectHabit[]> {
    return this.repository.deleteHabit(id);
  }

  async collapseBadHabit(id: string): Promise<SelectBadHabit[]> {
    return this.repository.collapseBadHabit(id);
  }

  async getProgress(
    habits: SelectHabit[],
    strategy: MilestoneStrategy = new DefaultMilestoneStrategy()
  ): Promise<{ percentage: number; level: number }> {
    return calculateProgress(habits, strategy);
  }
}
