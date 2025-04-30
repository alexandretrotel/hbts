import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getHabits, renameHabit } from "@/db/utils";
import { insertHabitSchema } from "@/db/zod";

export async function renameHabitCommand() {
  try {
    const spinner = ora("Fetching habits...").start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow("No habits recorded yet."));
      return;
    }

    spinner.succeed(chalk.green("Habits retrieved successfully."));

    // Prompt user to select a habit to rename
    const { habitId } = await inquirer.prompt([
      {
        type: "list",
        name: "habitId",
        message: "Select a habit to rename:",
        choices: habits.map((habit) => ({
          name: `${habit.name} (Stopped: ${new Date(
            habit.stoppedAt
          ).toLocaleString()})`,
          value: habit.id,
        })),
      },
    ]);

    // Find the selected habit
    const selectedHabit = habits.find((habit) => habit.id === habitId);
    if (!selectedHabit) {
      console.error(chalk.red("Error: Selected habit not found."));
      return;
    }

    // Prompt for the new name
    const { newName } = await inquirer.prompt([
      {
        type: "input",
        name: "newName",
        message: `Enter new name for "${selectedHabit.name}":`,
        validate: (input: string) => {
          if (!input.trim()) {
            return "Habit name cannot be empty.";
          }
          try {
            insertHabitSchema.parse({ name: input, startedAt: new Date() });
            return true;
          } catch (error) {
            return "Invalid habit name format.";
          }
        },
      },
    ]);

    // Confirm the rename action
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: chalk.yellow(
          `Confirm renaming "${selectedHabit.name}" to "${newName}"?`
        ),
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.gray("Action canceled."));
      return;
    }

    // Perform the rename
    const renameSpinner = ora("Renaming habit...").start();
    await renameHabit(habitId, newName);

    renameSpinner.succeed(
      chalk.green(`Habit renamed to "${newName}" successfully.`)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error renaming habit: ${message}`));
  }
}
