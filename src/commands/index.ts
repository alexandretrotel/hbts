import { Command } from 'commander';
import { setupCommand } from './setup';
import { HabitService } from '@/services/habits.service';
import { renameHabitCommand } from './rename';
import { addHabitCommand } from './add';
import { listHabitsCommand } from './list';
import { deleteHabitCommand } from './delete';
import { collapseHabitCommand } from './collapse';

export async function init(program: Command, habitService: HabitService) {
  program
    .command('setup')
    .description('Set up the habits CLI for the first time')
    .action(setupCommand);

  program
    .command('add')
    .description('Record when you stopped a bad habit')
    .argument(
      '<habit>',
      'Name of the habit (e.g., "watching porn", "smoking", etc...)'
    )
    .action((habit: string) => addHabitCommand(habit, habitService));

  program
    .command('list')
    .description('List all recorded habits with progress')
    .action(() => listHabitsCommand(habitService));

  program
    .command('rename')
    .description('Rename an existing habit')
    .action(() => renameHabitCommand(habitService));

  program
    .command('delete')
    .description('Delete an existing habit')
    .action(() => deleteHabitCommand(habitService));

  program
    .command('collapse')
    .description('Collapse an existing habit (i.e. remove all progress)')
    .action(() => collapseHabitCommand(habitService));
}
