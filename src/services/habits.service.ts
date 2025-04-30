import type { HabitRepository } from '@/db/repositories';
import type { InsertHabit, SelectHabit } from '@/db/zod';
import { calculateProgress } from '@/utils/progress';
import {
  DefaultMilestoneStrategy,
  type MilestoneStrategy,
} from '@/utils/milestones';

export class HabitService {
  constructor(private repository: HabitRepository) {}

  async addHabit(habit: InsertHabit): Promise<SelectHabit[]> {
    return this.repository.insertHabit(habit);
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

  async collapseHabit(id: string): Promise<SelectHabit[]> {
    return this.repository.collapseHabit(id);
  }

  async getProgress(
    habits: SelectHabit[],
    strategy: MilestoneStrategy = new DefaultMilestoneStrategy()
  ): Promise<{ percentage: number; level: number }> {
    return calculateProgress(habits, strategy);
  }
}
