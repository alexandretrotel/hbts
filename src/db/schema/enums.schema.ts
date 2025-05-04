import { pgEnum } from 'drizzle-orm/pg-core';

export const frequencyEnum = pgEnum('frequency', [
  'multiple_times_a_day',
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export const habitTypeEnum = pgEnum('habit_type', ['bad', 'good']);
