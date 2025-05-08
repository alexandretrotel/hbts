"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";

interface BadHabit {
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
  // This would come from your database in a real app
  const habits: BadHabit[] = [
    {
      id: "1",
      name: "Smoking",
      stoppedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      id: "2",
      name: "Social Media",
      stoppedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  const [timers, setTimers] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimers = () => {
      const newTimers: Record<string, string> = {};

      habits.forEach((habit) => {
        const secondsElapsed = Math.floor(
          (Date.now() - habit.stoppedAt.getTime()) / 1000
        );
        newTimers[habit.id] = formatDuration(secondsElapsed);
      });

      setTimers(newTimers);
    };

    // Initial update
    updateTimers();

    // Update every second
    const intervalId = setInterval(updateTimers, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Bad Habits</CardTitle>
      </CardHeader>
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
  );
}
