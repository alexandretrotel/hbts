"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import { useBadHabits } from "@/hooks/use-bad-habits";

export interface BadHabit {
  id: string;
  name: string;
  stoppedAt: Date;
}

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

export function BadHabits() {
  const { data: habits, isLoading } = useBadHabits();

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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Bad Habits</h2>

        <Card>
          <CardContent className="space-y-6">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Bad Habits</h2>

        <Card>
          <CardContent className="space-y-6">
            <p>No bad habits found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Bad Habits</h2>

      <Card>
        <CardContent className="space-y-6">
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-2">
              <h3 className="text-lg font-medium">{habit.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4 text-rose-500" />
                <span>Clean for: </span>
                <span className="font-mono font-medium">
                  {timers[habit.id] || "Loading..."}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
