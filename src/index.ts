#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { init } from '@/commands';
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { habitRepository } from '@/db';
import { HabitService } from '@/services/habits.service';

const homeEnvPath = path.join(os.homedir(), '.habits.env');
const localEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: [homeEnvPath, localEnvPath] });

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJsonData = await readFile(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonData);

if (!packageJson || typeof packageJson.version !== 'string') {
  console.error(
    chalk.red('Error: Invalid package.json file. Version not found.')
  );
  process.exit(1);
}

const version: string = packageJson.version;
const habitService = new HabitService(habitRepository);

const program = new Command();
program
  .name('hbts')
  .description('Track bad habits with progress tracking')
  .version(version);

await init(program, habitService);

const args = program.parse(process.argv);

if (args.args[0] !== 'setup' && !process.env.DATABASE_URL) {
  console.error(
    chalk.red(
      "Error: DATABASE_URL is not defined in ~/.habits.env or .env. Run 'habits setup' to configure it."
    )
  );
  process.exit(1);
}
