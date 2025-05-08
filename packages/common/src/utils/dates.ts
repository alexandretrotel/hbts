import type { FrequencyEnum } from "@hbts/db/zod";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

export const formatDate = (date: Date): string =>
  date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const isHabitDueToday = (
  frequency: FrequencyEnum,
  lastLogged: Date
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight

  lastLogged.setHours(0, 0, 0, 0); // Normalize time to midnight

  switch (frequency) {
    case "daily":
      return differenceInDays(today, lastLogged) >= 1;
    case "weekly":
      return differenceInWeeks(today, lastLogged) >= 1;
    case "monthly":
      return differenceInMonths(today, lastLogged) >= 1;
    case "yearly":
      return differenceInYears(today, lastLogged) >= 1;
    default:
      return false;
  }
};
