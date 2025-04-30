import ora from "ora";
import { getHabits } from "@/db/utils";
import chalk from "chalk";
import inquirer from "inquirer";
import { formatTimeSince } from "@/utils/progress";
import { deleteHabit } from "@/db/utils";

export async function deleteHabitCommand() {
  try {
    const spinner = ora("Fetching habits...").start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow("No habits recorded yet."));
      return;
    }

    spinner.succeed(chalk.green("Habits retrieved successfully."));

    // Prompt user to select habits to delete
    const { selectedHabits } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedHabits",
        message: "Select habits to delete:",
        choices: habits.map((habit) => ({
          name: `${habit.name} (Stopped: ${formatTimeSince(habit.stoppedAt)})`,
          value: { id: habit.id, name: habit.name },
        })),
      },
    ]);

    // Delete selected habits
    for (const habit of selectedHabits) {
      await deleteHabit(habit.id);
      console.log(chalk.green(`Deleted habit: ${habit.name}`));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error deleting habit: ${message}`));
  }
}
