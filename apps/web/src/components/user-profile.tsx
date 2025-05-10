"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/use-progress";
import { Badge } from "./ui/badge";

interface User {
  name: string;
  avatar: string;
  level: number | null;
  progress: number | null;
}

const LOGO_URL = "/logo.png";

export function UserProfile() {
  const progress = useProgress();

  const user: User = {
    name: "Alexandre Trotel",
    avatar: `${LOGO_URL}?height=100&width=100`,
    level: progress.level,
    progress: progress.percentage,
  };

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-zinc-100 dark:border-zinc-700">
          <AvatarImage src={user.avatar || LOGO_URL} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium">{user.name}</h2>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Level {user.level}
              </Badge>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <Progress value={user.progress} className="h-2" />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {user.progress?.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
