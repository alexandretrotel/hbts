import type { HabitService } from '@/services/habits.service';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

export async function logGoodHabitCommand(habitService: HabitService) {
  // first we need to fetch all good habits
  // then we go trough each habit
  // we ask the user if the habit was done today
  // and ask the user for the quantity if it's needed
  // then we log the habit

  try {
    const goodHabits = await habitService.getGoodHabits();

    if (goodHabits.length === 0) {
      console.log(chalk.yellow('No good habits found'));
    }

    goodHabits.forEach(async (habit) => {
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

      await habitService.logGoodHabit(data);
      spinner.succeed(
        chalk.green(
          `Logged "${habit.name}" on ${data.date.toLocaleDateString()}`
        )
      );
    });

    console.log(chalk.green('All habits logged successfully!'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error logging habit: ${message}`));
  }
}
