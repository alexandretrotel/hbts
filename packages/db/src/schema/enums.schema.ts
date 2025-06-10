import { pgEnum } from "drizzle-orm/pg-core";

export const frequencyEnum = pgEnum("frequency", [
	"daily",
	"weekly",
	"monthly",
	"yearly",
]);

export const habitTypeEnum = pgEnum("habit_type", ["bad", "good"]);
