import { Command } from "commander";
import { addHabitCommand } from "./add";
import { listHabitsCommand } from "./list";

export function init(program: Command) {
  program
    .command("add")
    .description("Record when you stopped a bad habit")
    .argument("<habit>", 'Name of the habit (e.g., "watching porn")')
    .action(addHabitCommand);

  program
    .command("list")
    .description("List all recorded habits with progress")
    .action(listHabitsCommand);
}
