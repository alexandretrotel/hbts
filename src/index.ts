import { Command } from "commander";
import { getHabits, insertHabit } from "./db/utils";
import { insertHabitSchema } from "./db/zod";
import { askConfirmation, formatDate } from "./utils";
import chalk from "chalk";
import ora from "ora";
import { createInterface } from "readline";
import { table } from "table";

const program = new Command();
export const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

program.name("habits").description("CLI to track bad habits").version("1.0.0");

program
  .command("add")
  .description("Record when you stopped a bad habit")
  .argument("<habit>", 'Name of the habit (e.g., "watching porn")')
  .action(async (habit: string) => {
    try {
      const confirm = await askConfirmation(
        chalk.yellow(`Confirm adding "${habit}"? (y/n): `)
      );

      if (!confirm) {
        console.log(chalk.gray("Action canceled."));
        return;
      }

      const spinner = ora("Recording habit...").start();
      const data = insertHabitSchema.parse({
        name: habit,
        startedAt: new Date(),
      });

      await insertHabit(data);

      spinner.succeed(
        chalk.green(`Stopped "${data.name}" on ${formatDate(data.startedAt)}`)
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error adding habit: ${message}`));
    } finally {
      rl.close();
      ora().stop();
    }
  });

program
  .command("list")
  .description("List all recorded habits")
  .action(async () => {
    try {
      const spinner = ora("Fetching habits...").start();
      const habits = await getHabits();

      if (habits.length === 0) {
        spinner.warn(chalk.yellow("No habits recorded yet."));
        return;
      }

      const tableData = [
        [chalk.bold("Habit"), chalk.bold("Stopped")],
        ...habits.map(({ name, startedAt }) => [name, formatDate(startedAt)]),
      ];

      spinner.succeed(chalk.green("Habits retrieved successfully."));
      console.log(
        table(tableData, {
          columns: { 0: { width: 5 }, 1: { width: 20 }, 2: { width: 20 } },
          drawHorizontalLine: (index, size) =>
            index === 0 || index === 1 || index === size,
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error listing habits: ${message}`));
    } finally {
      rl.close();
      ora().stop();
    }
  });

program.parse();
