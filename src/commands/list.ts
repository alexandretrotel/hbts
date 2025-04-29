import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { getHabits } from "../db/utils";
import { calculateProgress, formatTimeSince } from "../progress";
import { table } from "table";
import cliProgress from "cli-progress";
import type { SelectHabit } from "../db/zod";

export async function listHabitsCommand() {
  try {
    const spinner = ora("Fetching habits...").start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow("No habits recorded yet."));
      return;
    }

    spinner.succeed(chalk.green("Habits retrieved successfully."));

    // Calculate overall progress
    const totalProgress = calculateProgress(habits);
    const progressBar = new cliProgress.SingleBar(
      {
        format: "Overall Progress |{bar}| {percentage}% (Level {level})",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    progressBar.start(100, Math.min(totalProgress.percentage, 100), {
      level: totalProgress.level,
    });
    progressBar.stop();
    console.log();

    // Prompt user to select habits to view progress
    const { selectedHabits } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedHabits",
        message: "Select habits to view progress (or press Enter to view all):",
        choices: habits.map((habit) => ({
          name: `${habit.name} (Stopped: ${formatTimeSince(habit.startedAt)})`,
          value: habit.id,
        })),
      },
    ]);

    const habitsToShow =
      selectedHabits.length > 0
        ? habits.filter((habit) => selectedHabits.includes(habit.id))
        : habits;

    // Display table
    const tableData = [
      [chalk.bold("Habit"), chalk.bold("Stopped"), chalk.bold("Time Since")],
      ...habitsToShow.map(({ name, startedAt }) => [
        name,
        formatTimeSince(startedAt),
        formatTimeSince(startedAt, true), // Live updating
      ]),
    ];

    console.log(
      table(tableData, {
        columns: { 0: { width: 20 }, 1: { width: 20 }, 2: { width: 30 } },
        drawHorizontalLine: (index, size) =>
          index === 0 || index === 1 || index === size,
      })
    );

    // Start live timer
    startLiveTimer(habitsToShow);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Error listing habits: ${message}`));
  }
}

// Function to start live timer for selected habits
function startLiveTimer(habits: SelectHabit[]) {
  if (habits.length === 0) return;

  console.log(
    chalk.cyan("Live progress (updates every second, Ctrl+C to stop):")
  );

  const update = () => {
    console.clear();
    const tableData = [
      [chalk.bold("Habit"), chalk.bold("Time Since")],
      ...habits.map((habit) => [
        habit.name,
        formatTimeSince(habit.startedAt, true),
      ]),
    ];

    console.log(
      table(tableData, {
        columns: { 0: { width: 20 }, 1: { width: 30 } },
        drawHorizontalLine: (index, size) =>
          index === 0 || index === 1 || index === size,
      })
    );
  };

  update(); // Initial render
  const interval = setInterval(update, 1000);

  // Handle Ctrl+C to stop the timer
  process.on("SIGINT", () => {
    clearInterval(interval);
    console.log(chalk.gray("Stopped live progress."));
    process.exit(0);
  });
}
