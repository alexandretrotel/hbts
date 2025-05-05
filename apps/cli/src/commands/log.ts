import {
  getGoodHabits,
  getLastLoggedGoodHabit,
  logGoodHabit,
} from '@/services/habits.service';
import { isHabitDueToday } from '@/utils/dates';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

export async function logGoodHabitCommand() {
  try {
    const goodHabits = await getGoodHabits();

    if (goodHabits.length === 0) {
      console.log(chalk.yellow('No good habits found'));
      return;
    }

    let ignored = 0;
    for (const habit of goodHabits) {
      const lastLogged = await getLastLoggedGoodHabit(habit.id);

      if (lastLogged) {
        const isDueToday = isHabitDueToday(habit.frequency, lastLogged);

        if (!isDueToday) {
          ignored++;
          return;
        }
      }

      const checked = await confirm({
        message: `Did you do "${habit.name}" today?`,
        default: false,
      });

      let quantity: string | undefined = undefined;
      if (habit.quantity) {
        quantity = await input({
          message: `How many times did you do "${habit.name}" today?`,
          validate: (input) => {
            const parsed = parseInt(input);
            if (isNaN(parsed)) {
              return 'Please enter a valid number';
            }
            return true;
          },
        });
      }

      const spinner = ora('Logging good habit...').start();
      const data = {
        goodHabitId: habit.id,
        date: new Date(),
        quantity: quantity ? parseInt(quantity) : undefined,
        checked,
      };

      await logGoodHabit(data);
      spinner.succeed(
        chalk.green(
          `Logged "${habit.name}" on ${data.date.toLocaleDateString()}`
        )
      );
    }

    if (ignored === goodHabits.length) {
      console.log(chalk.yellow('No good habits due today'));
      return;
    }

    console.log(chalk.green('All habits logged successfully!'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error logging habit: ${message}`));
  }
}
