import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { insertHabit } from '@/db/utils';
import { insertHabitSchema } from '@/db/zod';
import { formatDate } from '@/utils/dates';

export async function addHabitCommand(habit: string) {
  try {
    // Prompt for confirmation using inquirer
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow(`Confirm adding "${habit}"?`),
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.gray('Action canceled.'));
      return;
    }

    const spinner = ora('Recording habit...').start();

    // Validate and parse habit data
    const data = insertHabitSchema.parse({
      name: habit,
      startedAt: new Date(),
    });

    // Insert habit into database
    await insertHabit(data);

    spinner.succeed(
      chalk.green(`Stopped "${data.name}" on ${formatDate(data.stoppedAt)}`)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error adding habit: ${message}`));
  }
}
