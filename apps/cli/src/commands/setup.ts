import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";

export async function setupCommand() {
	const spinner = ora("Setting up habits CLI...");

	try {
		// Prompt for DATABASE_URL
		const databaseUrl = await input({
			message: "Enter your PostgreSQL DATABASE_URL:",
			validate: (input: string) => {
				if (!input.trim()) {
					return "DATABASE_URL cannot be empty.";
				}

				// Basic validation for PostgreSQL URL format
				if (
					!input.startsWith("postgres://") &&
					!input.startsWith("postgresql://")
				) {
					return "DATABASE_URL must start with 'postgres://' or 'postgresql://'.";
				}

				return true;
			},
		});

		// Define the path for ~/.habits.env
		spinner.start();
		const homeEnvPath = path.join(os.homedir(), ".habits.env");

		// Write DATABASE_URL to ~/.habits.env
		await fs.writeFile(homeEnvPath, `DATABASE_URL=${databaseUrl}\n`, {
			mode: 0o600,
		});

		spinner.succeed(
			chalk.green("DATABASE_URL saved to ~/.habits.env successfully."),
		);
		console.log(chalk.cyan("You can now use the 'habits' command."));
	} catch (error) {
		spinner.stop();
		const message = error instanceof Error ? error.message : String(error);
		console.log(chalk.red(`Error setting up habits CLI: ${message}`));
	}
}
