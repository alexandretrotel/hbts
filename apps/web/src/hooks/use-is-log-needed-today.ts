import { useGoodHabits } from "./use-good-habits";
import { useGoodHabitsLogs } from "./use-good-habits-logs";
import { isHabitDueToday } from "@hbts/common/dates";

export const useIsLogNeededToday = () => {
  const { data: habits } = useGoodHabits();
  const { data: habitsLogs } = useGoodHabitsLogs();

  if (!habits || !habitsLogs || habits.length === 0) {
    return false;
  }

  // Get the most recent log date
  const latestLogDate = habitsLogs
    .map((log) => new Date(log.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const lastLogged = new Date(
    latestLogDate.getFullYear(),
    latestLogDate.getMonth(),
    latestLogDate.getDate(),
  );

  // Determine the shortest frequency among habits
  const shortestFrequency = habits
    .map((habit) => habit.frequency)
    .sort((a, b) => {
      const frequencyOrder = {
        daily: 1,
        weekly: 2,
        monthly: 3,
        yearly: 4,
      };
      return frequencyOrder[a] - frequencyOrder[b];
    })[0];

  // Helper function to check if a log is needed
  return isHabitDueToday(shortestFrequency, lastLogged);
};
