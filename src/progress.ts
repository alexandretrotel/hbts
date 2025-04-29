import type { SelectHabit } from "./db/zod";
import { formatDate } from "./utils";

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

  const now = new Date();
  const totalDays = habits.reduce((sum, habit) => {
    const diffMs = now.getTime() - habit.startedAt.getTime();
    return sum + diffMs / (1000 * 3600 * 24);
  }, 0);

  // Simple progression: 1 level per 30 days of total abstinence
  const level = Math.floor(totalDays / 30) + 1;
  // Percentage based on progress towards next level
  const percentage = ((totalDays % 30) / 30) * 100;

  return { percentage, level };
}
