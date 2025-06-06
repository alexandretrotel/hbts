import chalk from 'chalk';
import ora from 'ora';
import { collapseBadHabit, getBadHabits } from '@/services/habits.service';
import { checkbox, confirm } from '@inquirer/prompts';
import { formatTimeSince } from '@hbts/common/progress';

export async function collapseHabitCommand() {
  const spinner = ora('Fetching habits...').start();

  try {
    const habits = await getBadHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow('No habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Habits retrieved successfully.'));

    // Prompt user to select habits to collapse
    const selectedHabits = await checkbox({
      message: 'Select habits to collapse:',
      choices: habits.map((habit) => ({
        name: `${habit.name} (Stopped: ${formatTimeSince(habit.stoppedAt)})`,
        value: { id: habit.id, name: habit.name },
      })),
    });

    // Prompt user to confirm the action
    const confirmed = await confirm({
      message: chalk.yellow(
        `Are you sure you want to collapse ${selectedHabits.length} habit(s)?`
      ),
      default: false,
    });

    if (!confirmed) {
      console.log(chalk.yellow('Action cancelled by user.'));
      return;
    }

    // Collapse selected habits
    for (const habit of selectedHabits) {
      await collapseBadHabit(habit.id);
      console.log(chalk.green(`Collapsed habit: ${habit.name}`));
    }
  } catch (error) {
    spinner.stop();
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error collapsing habit: ${message}`));
  }
}
