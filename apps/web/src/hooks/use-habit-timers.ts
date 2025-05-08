import { BadHabit } from "@/app/api/bad-habits/route";
import { useEffect, useState } from "react";

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

export function useHabitTimers(habits: BadHabit[] | undefined) {
  const [timers, setTimers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!habits) return;

    const updateTimers = () => {
      const newTimers: Record<string, string> = {};
      habits.forEach((habit) => {
        const secondsElapsed = Math.floor(
          (Date.now() - new Date(habit.stoppedAt).getTime()) / 1000,
        );
        newTimers[habit.id] = formatDuration(secondsElapsed);
      });
      setTimers(newTimers);
    };

    updateTimers();
    const intervalId = setInterval(updateTimers, 1000);
    return () => clearInterval(intervalId);
  }, [habits]);

  return timers;
}
