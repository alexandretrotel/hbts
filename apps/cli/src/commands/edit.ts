import type { FrequencyEnum } from '@hbts/db/zod';
import { editHabit, getGoodHabits } from '@/services/habits.service';
import { confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

export async function editHabitCommand() {
  try {
    const spinner = ora('Fetching good habits...').start();
    const goodHabits = await getGoodHabits();

    if (goodHabits.length === 0) {
      spinner.warn(chalk.yellow('No good habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Good habits retrieved successfully.'));

    const selectedHabit = await select({
      message: 'Select a habit to rename:',
      choices: goodHabits.map((habit) => ({
        name: `${habit.name} (${habit.type})`,
        value: { id: habit.id, name: habit.name, type: habit.type },
      })),
    });

    if (!selectedHabit) {
      console.error(chalk.red('Error: Selected habit not found.'));
      return;
    }

    const newFrequency: FrequencyEnum = await select({
      message: `Select a new frequency for "${selectedHabit.name}":`,
      choices: [
        { name: 'Daily', value: 'daily' },
        { name: 'Weekly', value: 'weekly' },
        { name: 'Monthly', value: 'monthly' },
        { name: 'Yearly', value: 'yearly' },
      ],
    });

    const newQuantity = await confirm({
      message: `Does "${selectedHabit.name}" have a quantity? (yes/no)`,
      default: false,
    });

    const confirmed = await confirm({
      message: chalk.yellow(
        `Confirm editing "${selectedHabit.name}" to ${newFrequency} frequency with quantity ${newQuantity ? 'enabled' : 'disabled'}?`
      ),
      default: false,
    });

    if (!confirmed) {
      console.log(chalk.gray('Action canceled by user.'));
      return;
    }

    const editSpinner = ora('Editing habit...').start();
    await editHabit(selectedHabit.id, newFrequency, newQuantity);
    editSpinner.succeed(
      chalk.green(
        `Habit "${selectedHabit.name}" edited successfully to ${newFrequency} frequency with quantity ${newQuantity}.`
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error editing habit: ${message}`));
  }
}
