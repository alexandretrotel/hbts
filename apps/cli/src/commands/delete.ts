import { deleteHabit, getHabits } from "@/services/habits.service";
import { checkbox, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";

export async function deleteHabitCommand() {
	const spinner = ora("Fetching habits...").start();

	try {
		const habits = await getHabits();

		if (habits.length === 0) {
			spinner.warn(chalk.yellow("No habits recorded yet."));
			return;
		}

		spinner.succeed(chalk.green("Habits retrieved successfully."));

		// Prompt user to select habits to delete
		const selectedHabits = await checkbox({
			message: "Select habits to delete:",
			choices: habits.map((habit) => ({
				name: `${habit.name} (${habit.type})`,
				value: { id: habit.id, name: habit.name, type: habit.type },
			})),
		});

		// Prompt user to confirm the action
		const confirmed = await confirm({
			message: chalk.yellow(
				`Are you sure you want to delete ${selectedHabits.length} habit(s)?`,
			),
			default: false,
		});

		if (!confirmed) {
			console.log(chalk.yellow("Action cancelled by user."));
			return;
		}

		// Delete selected habits
		for (const habit of selectedHabits) {
			await deleteHabit(habit.id, habit.type);
			console.log(chalk.green(`Deleted habit: ${habit.name}`));
		}
	} catch (error) {
		spinner.stop();
		const message = error instanceof Error ? error.message : String(error);
		console.error(chalk.red(`Error deleting habit: ${message}`));
	}
}
