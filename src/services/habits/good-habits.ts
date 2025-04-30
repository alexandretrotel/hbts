import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { habits, habitLogs } from '@/db/schema';
import {
  insertHabitSchema,
  insertHabitLogSchema,
  type SelectHabit,
  type SelectHabitLog,
  type InsertHabit,
} from '@/db/zod';
import { summary } from 'date-streaks';
import { GamificationService } from '@/gamification';
import { MotivationService } from '@/motivation';
import { AppError } from '@/utils/errors';

export class GoodHabitService {
  constructor(
    private gamificationService: GamificationService,
    private motivationService: MotivationService
  ) {}

  async addHabit(data: Omit<InsertHabit, 'type' | 'stoppedAt'>) {
    const parsedData = insertHabitSchema.parse({
      ...data,
      type: 'good',
      stoppedAt: new Date(),
    });

    const [habit] = await db.insert(habits).values(parsedData).returning();

    return habit;
  }

  async logHabit(habitId: string, value?: number, completed?: boolean) {
    const habit = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.type, 'good')))
      .limit(1);

    if (!habit[0]) {
      throw new AppError('Habit not found or not a good habit');
    }

    const logData = insertHabitLogSchema.parse({
      habitId,
      value: habit[0].goal ? value : undefined,
      completed: habit[0].goal ? undefined : completed,
      loggedAt: new Date(),
    });

    const [log] = await db.insert(habitLogs).values(logData).returning();

    // Award XP based on difficulty
    const xp = this.calculateXP(habit[0].difficulty, habit[0].frequency);
    await this.gamificationService.addXP(habit[0].id, xp);

    return log;
  }

  async getHabitStats(habitId: string) {
    const logs = await db
      .select()
      .from(habitLogs)
      .where(eq(habitLogs.habitId, habitId))
      .orderBy(habitLogs.loggedAt);

    const habit = await db
      .select()
      .from(habits)
      .where(eq(habits.id, habitId))
      .limit(1);

    if (!habit[0]) {
      throw new AppError('Habit not found');
    }

    const stats = this.calculateStats(habit[0], logs);

    return {
      habit: habit[0],
      stats,
      motivation: this.motivationService.getMotivation(habit[0]),
    };
  }

  private calculateXP(difficulty: string, frequency: string): number {
    const difficultyMultipliers: Record<string, number> = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const frequencyMultipliers: Record<string, number> = {
      daily: 1,
      weekly: 0.5,
      monthly: 0.2,
      multiple_daily: 1.5,
    };

    return (
      10 *
      (difficultyMultipliers[difficulty] || 1) *
      (frequencyMultipliers[frequency] || 1)
    );
  }

  private calculateStats(habit: SelectHabit, logs: SelectHabitLog[]) {
    if (logs.length === 0) {
      return { average: 0, projection: 0, streak: 0 };
    }

    const totalValue = logs.reduce(
      (sum, log) => sum + (log.value || (log.completed ? 1 : 0)),
      0
    );

    const days = Math.ceil(
      (new Date().getTime() - habit.createdAt.getTime()) / (1000 * 3600 * 24)
    );
    const average = totalValue / Math.max(days, 1);

    // Project for one year
    const projection = average * 365;

    // Calculate streak
    const dates = logs
      .map((log) => new Date(log.loggedAt).toISOString().split('T')[0])
      .filter((date) => date !== undefined);
    const streakSummary = summary({ dates });
    const streak = streakSummary.currentStreak;

    return { average, projection, streak };
  }
}
