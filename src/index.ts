#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import os from "os";
import path from "path";
import { init } from "./commands";
import chalk from "chalk";

// Load environment variables from ~/.habits.env or .env
const homeEnvPath = path.join(os.homedir(), ".habits.env");
const localEnvPath = path.join(__dirname, "../../.env");
dotenv.config({ path: [homeEnvPath, localEnvPath] });

// Initialize the CLI program
const program = new Command();
program
  .name("hbts")
  .description("Track bad habits with progress tracking")
  .version("1.0.0");

// Register commands
init(program);

// Parse arguments
const args = program.parse(process.argv);

// Validate DATABASE_URL only if not running the setup command
if (args.args[0] !== "setup" && !process.env.DATABASE_URL) {
  console.error(
    chalk.red(
      "Error: DATABASE_URL is not defined in ~/.habits.env or .env. Run 'habits setup' to configure it."
    )
  );
  process.exit(1);
}
