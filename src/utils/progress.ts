import { MILESTONES } from '@/data';
import type { SelectHabit } from '@/db/zod';
import { formatDate } from './dates';

// Interface for progress calculation
interface Progress {
  percentage: number;
  level: number;
}

// Format time since a given date
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

// Calculate overall progress based on habits
export function calculateProgress(habits: SelectHabit[]): Progress {
  if (habits.length === 0) {
    return { percentage: 0, level: 1 };
  }

  // Calculate total abstinence time in milliseconds
  const now = new Date();
  const totalMs = habits.reduce((sum, habit) => {
    const stoppedAt = habit.stoppedAt || new Date(0);
    const diffMs = now.getTime() - stoppedAt.getTime();
    return sum + diffMs;
  }, 0);

  // Determine current level
  let level = 1;
  let currentMilestone = 0;
  let nextMilestone = MILESTONES[0] || 0;
  const numberOfMilestones = MILESTONES.length;
  const lastMilestone = MILESTONES[numberOfMilestones - 1] || 0;

  for (let i = 0; i < numberOfMilestones; i++) {
    const milestone = MILESTONES[i] || 0;

    if (totalMs >= milestone) {
      level = i + 2; // Level 1 is before first milestone, so +2
      currentMilestone = milestone;
      nextMilestone = MILESTONES[i + 1] || lastMilestone; // Use last milestone for post-year
    } else {
      break;
    }
  }

  // Handle levels beyond 11 (every 6 months after 1 year)
  if (totalMs > lastMilestone) {
    const sixMonthsMs = 15_768_000_000; // 6 months
    const yearsPassed = Math.floor((totalMs - lastMilestone) / sixMonthsMs);
    level += yearsPassed;
    currentMilestone = lastMilestone + yearsPassed * sixMonthsMs;
    nextMilestone = currentMilestone + sixMonthsMs;
  }

  // Calculate percentage progress toward next level
  const progressToNext = totalMs - currentMilestone;
  const totalToNext = nextMilestone - currentMilestone;
  const percentage = (progressToNext / totalToNext) * 100;

  return { percentage: Math.min(percentage, 100), level };
}
