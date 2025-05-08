"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BarChart3Icon, RepeatIcon } from "lucide-react";
import { FrequencyEnum } from "@hbts/db/zod";

interface GoodHabit {
  id: string;
  name: string;
  frequency: FrequencyEnum;
  hasQuantity: boolean;
  currentStreak: number;
  totalQuantity: number | null;
  startedAt: Date;
  projectedYearlyQuantity: number | null;
  streakDays: boolean[];
}

export function GoodHabits() {
  const habits: GoodHabit[] = [
    {
      id: "1",
      name: "Morning Meditation",
      frequency: "daily",
      hasQuantity: true,
      currentStreak: 12,
      totalQuantity: 180,
      startedAt: new Date("2023-12-01"),
      projectedYearlyQuantity: 365,
      streakDays: Array(14).fill(true).concat(Array(7).fill(false)),
    },
    {
      id: "2",
      name: "Weekly Exercise",
      frequency: "weekly",
      hasQuantity: true,
      currentStreak: 8,
      totalQuantity: 32,
      startedAt: new Date("2024-01-15"),
      projectedYearlyQuantity: 52,
      streakDays: Array(8).fill(true),
    },
    {
      id: "3",
      name: "Reading",
      frequency: "daily",
      hasQuantity: false,
      currentStreak: 21,
      totalQuantity: null,
      startedAt: new Date("2024-02-01"),
      projectedYearlyQuantity: null,
      streakDays: Array(21).fill(true),
    },
  ];

  return (
    <div className="flex flex-col justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Good Habits</h2>

      <Card>
        <CardContent className="space-y-6">
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{habit.name}</h3>
                <Badge
                  variant="outline"
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

                {habit.hasQuantity && habit.totalQuantity !== null && (
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
        </CardContent>
      </Card>
    </div>
  );
}
