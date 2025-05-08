import { GoodHabit } from "@/app/api/good-habits/route";
import { fetcher } from "@/lib/swr";
import useSWR from "swr";

export const useGoodHabits = () => {
  return useSWR<GoodHabit[]>("/api/good-habits", fetcher);
};
