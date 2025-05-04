import { getHabits, renameHabit } from '@/services/habits.service';
import { select, input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

export async function renameHabitCommand() {
  try {
    const spinner = ora('Fetching habits...').start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow('No habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Habits retrieved successfully.'));

    const selectedHabit = await select({
      message: 'Select a habit to rename:',
      choices: habits.map((habit) => ({
        name: `${habit.name} (${habit.type})`,
        value: habit,
      })),
    });

    if (!selectedHabit) {
      console.error(chalk.red('Error: Selected habit not found.'));
      return;
    }

    const newName = await input({
      message: `Enter new name for "${selectedHabit.name}":`,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Habit name cannot be empty.';
        }
        return true;
      },
    });

    const confirmed = await confirm({
      message: chalk.yellow(
        `Confirm renaming "${selectedHabit.name}" to "${newName}"?`
      ),
      default: false,
    });

    if (!confirmed) {
      console.log(chalk.gray('Action canceled by user.'));
      return;
    }

    const renameSpinner = ora('Renaming habit...').start();
    await renameHabit(selectedHabit.id, newName, selectedHabit.type);
    renameSpinner.succeed(
      chalk.green(`Habit renamed to "${newName}" successfully.`)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error renaming habit: ${message}`));
  }
}
