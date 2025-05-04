import { DefaultMilestoneStrategy, type MilestoneStrategy } from './milestones';
import type { SelectBadHabit } from '@/db/zod';
import { formatDate } from './dates';

export interface Progress {
  percentage: number;
  level: number;
}

export function formatTimeSince(date: Date, live = false): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const days = Math.floor(diffSec / (3600 * 24));
  const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  if (live) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return formatDate(date);
}

export function calculateProgress(
  habits: SelectBadHabit[],
  strategy: MilestoneStrategy = new DefaultMilestoneStrategy()
): Progress {
  if (habits.length === 0) {
    return { percentage: 0, level: 1 };
  }

  const now = new Date();
  const totalMs = habits.reduce((sum, habit) => {
    const stoppedAt = habit.stoppedAt || new Date(0);
    const diffMs = now.getTime() - stoppedAt.getTime();
    return sum + diffMs;
  }, 0);

  const { level, currentMilestone, nextMilestone } =
    strategy.calculateLevel(totalMs);
  const percentage = strategy.getPercentage(
    totalMs,
    currentMilestone,
    nextMilestone
  );

  return { percentage, level };
}
