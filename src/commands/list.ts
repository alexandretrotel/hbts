import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { HabitService } from '@/services/habits.service';
import {
  renderProgressBar,
  renderHabitsTable,
  startLiveTimer,
} from '@/utils/ui';
import { formatTimeSince } from '@/utils/progress';

export async function listHabitsCommand(habitService: HabitService) {
  try {
    const spinner = ora('Fetching habits...').start();
    const habits = await habitService.getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow('No habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Habits retrieved successfully.'));

    const progress = await habitService.getProgress(habits);
    renderProgressBar(progress.percentage, progress.level);

    const selectedHabits = await checkbox({
      message: 'Select habits to view progress:',
      choices: habits.map((habit) => ({
        name: `${habit.name} (Stopped: ${formatTimeSince(habit.stoppedAt)})`,
        value: habit.id,
      })),
    });

    const habitsToShow =
      selectedHabits.length > 0
        ? habits.filter((habit) => selectedHabits.includes(habit.id))
        : habits;

    renderHabitsTable(habitsToShow);
    startLiveTimer(habitsToShow);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error listing habits: ${message}`));
  }
}
