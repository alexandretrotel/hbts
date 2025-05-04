import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { HabitService } from '@/services/habits.service';
import {
  insertBadHabitSchema,
  insertGoodHabitSchema,
  type HabitType,
} from '@/db/zod';
import { formatDate } from '@/utils/dates';
import { select } from '@inquirer/prompts';

export async function addHabitCommand(
  habit: string,
  habitType: HabitType,
  habitService: HabitService
) {
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
          { name: 'Multiple times a day', value: 'multiple_times_a_day' },
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

      await habitService.addGoodHabit(data);
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

      await habitService.addBadHabit(data);
      spinner.succeed(
        chalk.green(`Stopped "${data.name}" on ${formatDate(data.stoppedAt)}`)
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error adding habit: ${message}`));
  }
}
