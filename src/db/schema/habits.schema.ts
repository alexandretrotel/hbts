import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const badHabits = pgTable('bad_habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  stoppedAt: timestamp('stopped_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
