export interface MilestoneStrategy {
  calculateLevel(totalMs: number): {
    level: number;
    currentMilestone: number;
    nextMilestone: number;
  };
  getPercentage(
    totalMs: number,
    currentMilestone: number,
    nextMilestone: number
  ): number;
}

export class DefaultMilestoneStrategy implements MilestoneStrategy {
  private readonly MILESTONES = [
    60_000, // 1 minute
    3_600_000, // 1 hour
    43_200_000, // 12 hours
    86_400_000, // 1 day
    172_800_000, // 2 days
    604_800_000, // 7 days
    1_296_000_000, // 15 days
    2_628_000_000, // 1 month
    5_256_000_000, // 2 months
    15_768_000_000, // 6 months
    31_536_000_000, // 1 year
  ];

  calculateLevel(totalMs: number): {
    level: number;
    currentMilestone: number;
    nextMilestone: number;
  } {
    let level = 1;
    let currentMilestone = 0;
    let nextMilestone = this.MILESTONES[0] || 0;
    const lastMilestone = this.MILESTONES[this.MILESTONES.length - 1] || 0;

    for (let i = 0; i < this.MILESTONES.length; i++) {
      const milestone = this.MILESTONES[i] || 0;
      if (totalMs >= milestone) {
        level = i + 2;
        currentMilestone = milestone;
        nextMilestone = this.MILESTONES[i + 1] || lastMilestone;
      } else {
        break;
      }
    }

    if (totalMs > lastMilestone) {
      const sixMonthsMs = 15_768_000_000;
      const yearsPassed = Math.floor((totalMs - lastMilestone) / sixMonthsMs);
      level += yearsPassed;
      currentMilestone = lastMilestone + yearsPassed * sixMonthsMs;
      nextMilestone = currentMilestone + sixMonthsMs;
    }

    return { level, currentMilestone, nextMilestone };
  }

  getPercentage(
    totalMs: number,
    currentMilestone: number,
    nextMilestone: number
  ): number {
    const progressToNext = totalMs - currentMilestone;
    const totalToNext = nextMilestone - currentMilestone;
    return Math.min((progressToNext / totalToNext) * 100, 100);
  }
}
