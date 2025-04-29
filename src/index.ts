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

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error(
    chalk.red("Error: DATABASE_URL is not defined in ~/.habits.env or .env")
  );
  process.exit(1);
}

// Initialize the CLI program
const program = new Command();
program
  .name("hbts")
  .description("Track bad habits with progress tracking")
  .version("1.0.0");

// Register commands
init(program);

// Parse and execute
program.parse();
