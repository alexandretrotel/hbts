import { Command } from "commander";
import { addHabitCommand } from "./add";
import { listHabitsCommand } from "./list";
import { renameHabitCommand } from "./rename";
import { setupCommand } from "./setup";

export function init(program: Command) {
  program
    .command("add")
    .description("Record when you stopped a bad habit")
    .argument(
      "<habit>",
      'Name of the habit (e.g., "watching porn", "smoking", etc...)'
    )
    .action(addHabitCommand);

  program
    .command("list")
    .description("List all recorded habits with progress")
    .action(listHabitsCommand);

  program
    .command("rename")
    .description("Rename an existing habit")
    .action(renameHabitCommand);

  program
    .command("setup")
    .description("Set up the habits CLI for the first time")
    .action(setupCommand);
}
