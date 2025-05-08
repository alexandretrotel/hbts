import { GoodHabitLog } from "@/app/api/good-habits-logs/route";
import { fetcher } from "@/lib/swr";
import useSWR from "swr";

export const useGoodHabitsLogs = () => {
  return useSWR<GoodHabitLog[]>("/api/good-habits-logs", fetcher);
};
