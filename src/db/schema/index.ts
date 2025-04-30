import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  real,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const habitTypeEnum = pgEnum('habit_type', ['bad', 'good']);
export const habitDifficultyEnum = pgEnum('habit_difficulty', [
  'easy',
  'medium',
  'hard',
]);
export const habitFrequencyEnum = pgEnum('habit_frequency', [
  'daily',
  'weekly',
  'monthly',
  'multiple_daily',
]);

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: habitTypeEnum('type').notNull(),
  difficulty: habitDifficultyEnum('difficulty').notNull(),
  frequency: habitFrequencyEnum('frequency').notNull(),
  isOptional: boolean('is_optional').default(false),
  goal: real('goal'), // For quantitative habits (e.g., 10 push-ups)
  unit: text('unit'), // For quantitative habits (e.g., "push-ups", "pages")
  stoppedAt: timestamp('started_at').notNull(), // For bad habits
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const habitLogs = pgTable('habit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id)
    .notNull(),
  value: real('value'), // For quantitative habits (e.g., 15 push-ups)
  completed: boolean('completed').default(false), // For boolean habits
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // For future multi-user support
  xp: integer('xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
