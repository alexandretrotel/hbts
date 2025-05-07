import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { getHabits, getProgress } from '@/services/habits.service';
import {
  renderProgressBar,
  renderHabitsTable,
  startLiveTimer,
} from '@/utils/ui';
import type { SelectBadHabit } from '@hbts/db/zod';

export async function listHabitsCommand() {
  const spinner = ora('Fetching habits...').start();

  try {
    const habits = await getHabits();
    const badHabits: SelectBadHabit[] = habits.filter(
      (habit) => habit.type === 'bad'
    ) as SelectBadHabit[];

    if (habits.length === 0) {
      spinner.warn(chalk.yellow('No habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Habits retrieved successfully.'));

    const progress = await getProgress(badHabits);
    renderProgressBar(progress.percentage, progress.level);

    const selectedHabits = await checkbox({
      message: 'Select habits to view progress:',
      choices: habits.map((habit) => ({
        name: `${habit.name} (${habit.type})`,
        value: habit.id,
      })),
    });

    const habitsToShow =
      selectedHabits.length > 0
        ? habits.filter((habit) => selectedHabits.includes(habit.id))
        : habits;

    const badHabitsToShow: SelectBadHabit[] = habitsToShow.filter(
      (habit) => habit.type === 'bad'
    ) as SelectBadHabit[];
    renderHabitsTable(badHabitsToShow);
    startLiveTimer(badHabitsToShow);
  } catch (error) {
    spinner.stop();
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error listing habits: ${message}`));
  }
}
