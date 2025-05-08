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

    const dateRange = Array.from(
      {
        length:
          Math.ceil(
            (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1,
      },
      (_, i) => new Date(minDate.getTime() + i * 1000 * 60 * 60 * 24),
    );

    const streakData = summary({ dates: dateRange });

    const totalQuantity = habitLogs.reduce(
      (acc, log) => acc + (log.quantity || 0),
      0,
    );

    const daysSinceStart = dateRange.length;
    const projectedYearlyQuantity =
      habit.quantity && daysSinceStart > 0
        ? Math.round((totalQuantity / daysSinceStart) * 365)
        : null;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    const logTimestamps = habitLogs.map((log) => {
      const d = new Date(log.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    const streakDays = weekDates.map((date) => logTimestamps.includes(date));

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
