import { DefaultMilestoneStrategy } from "@hbts/common/milestones";
import { calculateProgress } from "@hbts/common/progress";
import { useBadHabits } from "./use-bad-habits";

export const useProgress = () => {
  const { data: badHabits } = useBadHabits();

  if (!badHabits) {
    return { percentage: 0, level: 1 };
  }

  const strategy = new DefaultMilestoneStrategy();
  const progress = calculateProgress(badHabits, strategy);
  return progress;
};
