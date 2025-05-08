import { BadHabit } from "@/app/api/bad-habits/route";
import { fetcher } from "@/lib/swr";
import useSWR from "swr";

export const useBadHabits = () => {
  return useSWR<BadHabit[]>("/api/bad-habits", fetcher);
};
