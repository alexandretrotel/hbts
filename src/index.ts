import { Command } from "commander";
import { getHabits, insertHabit } from "./db/utils";
import { insertHabitSchema } from "./db/zod";

const program = new Command();

program.name("habits").description("CLI to track bad habits").version("1.0.0");

program
  .command("add")
  .description("Record when you stopped a bad habit")
  .argument("<habit>", 'Name of the habit (e.g., "watching porn")')
  .action(async (habit: string) => {
    try {
      const data = insertHabitSchema.parse({
        name: habit,
        startedAt: new Date(),
      });

      await insertHabit(data);

      console.log(
        `Recorded stopping "${habit}" at ${data.startedAt.toISOString()}`
      );
    } catch (error) {
      console.error(
        "Error adding habit:",
        error instanceof Error ? error.message : error
      );
    }
  });

program
  .command("list")
  .description("List all recorded habits")
  .action(async () => {
    try {
      const habits = await getHabits();

      if (habits.length === 0) {
        console.log("No habits recorded yet.");
        return;
      }

      habits.forEach(({ name, startedAt }) => {
        console.log(`Habit: ${name} | Stopped: ${startedAt.toISOString()}`);
      });
    } catch (error) {
      console.error(
        "Error listing habits:",
        error instanceof Error ? error.message : error
      );
    }
  });

program.parse();
