import {
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { frequencyEnum } from './enums.schema';

export const badHabits = pgTable('bad_habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  stoppedAt: timestamp('stopped_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goodHabits = pgTable('good_habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  frequency: frequencyEnum('frequency').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goodHabitsDailyLog = pgTable(
  'good_habits_daily_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    goodHabitId: uuid('good_habit_id')
      .notNull()
      .references(() => goodHabits.id, {
        onDelete: 'cascade',
      }),
    date: timestamp('date').notNull(),
    quantity: real('quantity'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [unique().on(t.goodHabitId, t.date)]
);
