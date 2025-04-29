import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startedAt: timestamp("started_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
