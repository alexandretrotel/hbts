#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { init } from "@/commands";
import chalk from "chalk";
import { Command } from "commander";

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJsonData = await readFile(packageJsonPath, "utf-8");
const packageJson = JSON.parse(packageJsonData);

if (!packageJson || typeof packageJson.version !== "string") {
	console.error(
		chalk.red("Error: Invalid package.json file. Version not found."),
	);
	process.exit(1);
}

const version: string = packageJson.version;

const program = new Command();
program
	.name("hbts")
	.description("Track bad habits with progress tracking")
	.version(version);

await init(program);

program.parse(process.argv);
