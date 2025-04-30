import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { getHabits } from '@/db/utils';
import { calculateProgress, formatTimeSince } from '@/utils/progress';
import { table } from 'table';
import cliProgress from 'cli-progress';
import type { SelectHabit } from '@/db/zod';

export async function listHabitsCommand() {
  try {
    const spinner = ora('Fetching habits...').start();
    const habits = await getHabits();

    if (habits.length === 0) {
      spinner.warn(chalk.yellow('No habits recorded yet.'));
      return;
    }

    spinner.succeed(chalk.green('Habits retrieved successfully.'));

    // Calculate overall progress
    const totalProgress = calculateProgress(habits);
    const progressBar = new cliProgress.SingleBar(
      {
        format: 'Overall Progress |{bar}| {percentage}% (Level {level})',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
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
        type: 'checkbox',
        name: 'selectedHabits',
        message: 'Select habits to view progress:',
        choices: habits.map((habit) => ({
          name: `${habit.name} (Stopped: ${formatTimeSince(habit.stoppedAt)})`,
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
      [chalk.bold('Habit'), chalk.bold('Stopped'), chalk.bold('Time Since')],
      ...habitsToShow.map(({ name, stoppedAt }) => [
        name,
        formatTimeSince(stoppedAt),
        formatTimeSince(stoppedAt, true), // Live updating
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
    chalk.cyan('Live progress (updates every second, Ctrl+C to stop):')
  );

  const update = () => {
    console.clear();
    console.log(chalk.gray("Press 'Ctrl+C' to stop live progress."));

    const tableData = [
      [chalk.bold('Habit'), chalk.bold('Time Since')],
      ...habits.map((habit) => [
        habit.name,
        formatTimeSince(habit.stoppedAt, true),
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

  // Handle SIGINT (Ctrl+C) explicitly
  process.on('SIGINT', () => {
    clearInterval(interval);
    if (process.stdin.isTTY) process.stdin.setRawMode(false); // Reset raw mode
    process.stdin.pause();
    console.log(chalk.gray('\nStopped live progress.'));
    process.exit(0);
  });
}
