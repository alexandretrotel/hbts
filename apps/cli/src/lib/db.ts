import { setupCommand } from "@/commands/setup";
import { initDb } from "@hbts/db";

export const db = await initDb(setupCommand);
