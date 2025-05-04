import chalk from 'chalk';
import { table } from 'table';
import cliProgress from 'cli-progress';
import { formatTimeSince } from './progress';
import type { SelectBadHabit } from '@/db/zod';

export function renderProgressBar(percentage: number, level: number) {
  const progressBar = new cliProgress.SingleBar(
    {
      format: 'Overall Progress |{bar}| {percentage}% (Level {level})',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(100, Math.min(percentage, 100), { level });
  progressBar.stop();
  console.log();
}

export function renderHabitsTable(habits: SelectBadHabit[]) {
  const tableData = [
    [chalk.bold('Habit'), chalk.bold('Stopped'), chalk.bold('Time Since')],
    ...habits.map(({ name, stoppedAt }) => [
      name,
      formatTimeSince(stoppedAt),
      formatTimeSince(stoppedAt, true),
    ]),
  ];

  console.log(
    table(tableData, {
      columns: { 0: { width: 20 }, 1: { width: 20 }, 2: { width: 30 } },
      drawHorizontalLine: (index, size) =>
        index === 0 || index === 1 || index === size,
    })
  );
}

export function startLiveTimer(habits: SelectBadHabit[]) {
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

  update();
  const interval = setInterval(update, 1000);

  process.on('SIGINT', () => {
    clearInterval(interval);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    console.log(chalk.gray('\nStopped live progress.'));
    process.exit(0);
  });
}
