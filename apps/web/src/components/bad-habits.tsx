"use client";

import { ClockIcon } from "lucide-react";
import { useBadHabits } from "@/hooks/use-bad-habits";
import { SectionCard } from "@/components/section-card";
import { useHabitTimers } from "@/hooks/use-habit-timers";
import { HabitSkeleton } from "@/components/habit-skeleton";

export function BadHabits() {
  const { data: habits, isLoading } = useBadHabits();
  const timers = useHabitTimers(habits);

  if (isLoading) {
    return (
      <SectionCard title="Bad Habits">
        {[...Array(3)].map((_, i) => (
          <HabitSkeleton key={i} />
        ))}
      </SectionCard>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <SectionCard title="Bad Habits">
        <p>No bad habits found.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Bad Habits">
      {habits.map((habit) => (
        <div key={habit.id} className="space-y-2">
          <h3 className="text-lg font-medium">{habit.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-rose-500" />
            <span>Clean for:</span>
            <span className="font-mono font-medium">
              {timers[habit.id] || "Loading..."}
            </span>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
