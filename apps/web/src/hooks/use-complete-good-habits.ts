import { useGoodHabits } from "@/hooks/use-good-habits";
import { useGoodHabitsLogs } from "@/hooks/use-good-habits-logs";
import { summary } from "date-streaks";

export function useCompleteGoodHabits() {
  const { data: habits, isLoading: isLoadingHabits } = useGoodHabits();
  const { data: logs, isLoading: isLoadingLogs } = useGoodHabitsLogs();

  const isLoading = isLoadingHabits || isLoadingLogs;

  const completeHabits = habits?.map((habit) => {
    const habitLogs = logs?.filter((log) => log.goodHabitId === habit.id) || [];

    if (habitLogs.length === 0) {
      return {
        ...habit,
        streakDays: [],
        currentStreak: 0,
        totalQuantity: null,
        startedAt: null,
        projectedYearlyQuantity: null,
      };
    }

    const logDates = habitLogs.map((log) => new Date(log.date));
    const minDate = new Date(Math.min(...logDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...logDates.map((d) => d.getTime())));
    const logDateStrings = new Set(
      logDates.map((d) => d.toISOString().split("T")[0]),
    );

    const dateRange = Array.from(
      {
        length:
          Math.ceil(
            (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1,
      },
      (_, i) => new Date(minDate.getTime() + i * 1000 * 60 * 60 * 24),
    );

    const streakDays = dateRange.map((date) =>
      logDateStrings.has(date.toISOString().split("T")[0]),
    );

    const streakData = summary({ dates: logDates });

    const totalQuantity = habitLogs.reduce(
      (acc, log) => acc + (log.quantity || 0),
      0,
    );

    const daysSinceStart =
      (Date.now() - minDate.getTime()) / (1000 * 60 * 60 * 24);

    const projectedYearlyQuantity =
      habit.quantity && daysSinceStart > 0
        ? Math.round((totalQuantity / daysSinceStart) * 365)
        : null;

    return {
      ...habit,
      streakDays,
      currentStreak: streakData.currentStreak,
      totalQuantity,
      startedAt: minDate,
      projectedYearlyQuantity,
    };
  });

  return { completeHabits, isLoading };
}
