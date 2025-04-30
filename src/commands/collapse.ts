import chalk from "chalk";
import ora from "ora";
import { collapseHabit, getHabits } from "../db/utils";
import inquirer from "inquirer";
import { formatTimeSince } from "../utils/progress";

export async function collapseHabitCommand(habitId: string) {
  try {
    const spinner = ora("Fetching habits...").start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow("No habits recorded yet."));
      return;
    }

    spinner.succeed(chalk.green("Habits retrieved successfully."));

    // Prompt user to select habits to collapse
    const { selectedHabits } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedHabits",
        message: "Select habits to delete:",
        choices: habits.map((habit) => ({
          name: `${habit.name} (Stopped: ${formatTimeSince(habit.startedAt)})`,
          value: { id: habit.id, name: habit.name },
        })),
      },
    ]);

    // Collapse selected habits
    for (const habit of selectedHabits) {
      await collapseHabit(habit.id);
      console.log(chalk.green(`Deleted habit: ${habit.name}`));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error collapsing habit: ${message}`));
  }
}
