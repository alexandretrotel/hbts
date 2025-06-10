import type { Command } from "commander";
import { addHabitCommand } from "./add";
import { collapseHabitCommand } from "./collapse";
import { deleteHabitCommand } from "./delete";
import { editHabitCommand } from "./edit";
import { listHabitsCommand } from "./list";
import { logGoodHabitCommand } from "./log";
import { renameHabitCommand } from "./rename";
import { setupCommand } from "./setup";

export async function init(program: Command) {
	program
		.command("setup")
		.description("Set up the habits CLI for the first time")
		.action(setupCommand);

	program
		.command("add")
		.description("Record when you stopped a bad habit")
		.argument(
			"<habit>",
			'Name of the habit (e.g., "watching porn", "smoking", "do workout", "drink water", etc...)',
		)
		.option("-g, --good", "Mark the habit as a good habit")
		.option("-b, --bad", "Mark the habit as a bad habit")
		.action((habit: string, options: { good?: boolean; bad?: boolean }) => {
			if (options.good && options.bad) {
				console.error(
					"You cannot specify both --good and --bad for the same habit.",
				);
				process.exit(1);
			}

			const habitType = options.good
				? "good"
				: options.bad
					? "bad"
					: "unspecified";

			if (habitType === "unspecified") {
				console.error("You must specify either --good or --bad for the habit.");
				process.exit(1);
			}

			addHabitCommand(habit, habitType);
		});

	program
		.command("list")
		.description("List all recorded habits with progress")
		.action(listHabitsCommand);

	program
		.command("rename")
		.description("Rename an existing habit")
		.action(renameHabitCommand);

	program
		.command("delete")
		.description("Delete an existing habit")
		.action(deleteHabitCommand);

	program
		.command("collapse")
		.description("Collapse an existing habit (i.e. remove all progress)")
		.action(collapseHabitCommand);

	program
		.command("log")
		.description("Log a good habit")
		.action(logGoodHabitCommand);

	program
		.command("edit")
		.description("Edit an existing habit")
		.action(editHabitCommand);
}
