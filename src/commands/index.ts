import { Command } from "commander";
import { setupCommand } from "./setup";

export async function init(program: Command) {
  program
    .command("setup")
    .description("Set up the habits CLI for the first time")
    .action(setupCommand);

  if (process.env.DATABASE_URL) {
    const { renameHabitCommand } = await import("./rename");
    const { addHabitCommand } = await import("./add");
    const { listHabitsCommand } = await import("./list");

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
  }
}
