"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BarChart3Icon, RepeatIcon } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { useCompleteGoodHabits } from "@/hooks/use-complete-good-habits";
import { HabitSkeleton } from "@/components/habit-skeleton";

export function GoodHabits() {
  const { completeHabits, isLoading } = useCompleteGoodHabits();

  if (isLoading) {
    return (
      <SectionCard title="Good Habits">
        {[...Array(3)].map((_, i) => (
          <HabitSkeleton key={i} />
        ))}
      </SectionCard>
    );
  }

  if (!completeHabits || completeHabits.length === 0) {
    return (
      <SectionCard title="Good Habits">
        <p>No good habits found.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Good Habits">
      {completeHabits.map((habit) => (
        <div key={habit.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{habit.name}</h3>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 font-normal"
            >
              <RepeatIcon className="h-3 w-3" />
              {habit.frequency}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {habit.streakDays.map((active, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-sm ${
                  active
                    ? "bg-emerald-500 dark:bg-emerald-600"
                    : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>
                Current streak: <strong>{habit.currentStreak}</strong>
              </span>
            </div>

            {habit.quantity && habit.totalQuantity !== null && (
              <div className="flex items-center gap-1">
                <BarChart3Icon className="h-4 w-4" />
                <span>
                  Total: <strong>{habit.totalQuantity}</strong>
                </span>
              </div>
            )}

            {habit.projectedYearlyQuantity !== null && (
              <div className="flex items-center gap-1">
                <BarChart3Icon className="h-4 w-4" />
                <span>
                  Projected yearly:{" "}
                  <strong>{habit.projectedYearlyQuantity}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
