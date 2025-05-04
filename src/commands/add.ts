import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import {
  insertBadHabitSchema,
  insertGoodHabitSchema,
  type HabitType,
} from '@/db/zod';
import { formatDate } from '@/utils/dates';
import { select } from '@inquirer/prompts';
import { insertBadHabit, insertGoodHabit } from '@/services/habits.service';

export async function addHabitCommand(habit: string, habitType: HabitType) {
  try {
    const confirmed = await confirm({
      message: chalk.yellow(`Confirm adding "${habit}"?`),
      default: false,
    });

    if (!confirmed) {
      console.log(chalk.gray('Action canceled.'));
      return;
    }

    if (habitType === 'good') {
      const frequency = await select({
        message: 'How often do you want to track this habit?',
        choices: [
          { name: 'Daily', value: 'daily' },
          { name: 'Weekly', value: 'weekly' },
          { name: 'Monthly', value: 'monthly' },
          { name: 'Yearly', value: 'yearly' },
        ],
      });

      const quantity = await select({
        message: 'Does this habit have a quantity?',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
      });

      const spinner = ora('Recording good habit...').start();
      const data = insertGoodHabitSchema.parse({
        name: habit,
        frequency,
        quantity,
        createdAt: new Date(),
      });

      await insertGoodHabit(data);
      spinner.succeed(
        chalk.green(
          `Added "${data.name}" on ${formatDate(data.createdAt || new Date())}`
        )
      );
    } else {
      const spinner = ora('Recording bad habit...').start();
      const data = insertBadHabitSchema.parse({
        name: habit,
        stoppedAt: new Date(),
      });

      await insertBadHabit(data);
      spinner.succeed(
        chalk.green(`Stopped "${data.name}" on ${formatDate(data.stoppedAt)}`)
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error adding habit: ${message}`));
  }
}
