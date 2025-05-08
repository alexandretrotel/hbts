import { useGoodHabits } from "@/hooks/use-good-habits";
import { useGoodHabitsLogs } from "@/hooks/use-good-habits-logs";
import { getCurrentWeekTimestamps } from "@/utils/get-current-week-timestamps";
import { getDateRange } from "@/utils/get-date-range";
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
    const { minDate, range: dateRange } = getDateRange(logDates);
    const streakData = summary({ dates: dateRange });

    const totalQuantity = habitLogs.reduce(
      (sum, log) => sum + (log.quantity || 0),
      0,
    );

    const daysTracked = dateRange.length;
    const projectedYearlyQuantity =
      habit.quantity && daysTracked > 0
        ? Math.round((totalQuantity / daysTracked) * 365)
        : null;

    const currentWeekTimestamps = getCurrentWeekTimestamps();
    const logTimestamps = habitLogs.map((log) => {
      const date = new Date(log.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const streakDays = currentWeekTimestamps.map((ts) =>
      logTimestamps.includes(ts),
    );

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
