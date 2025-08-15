import { mysqlTable, varchar, int, primaryKey } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  isVerified: int('is_verified').default(0).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
});

export const postsTable = mysqlTable('timeslots', {
  date: varchar('date', { length: 20 }).notNull(),
  time: varchar('time', { length: 20 }).notNull(),

  userId: int('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  content: varchar('content', { length: 500 }).notNull(),

  endTime: varchar('endTime', { length: 20 }).notNull(),

  location: varchar('location', { length: 100 }).notNull(),

  bookedBy: int('booked_by'),

  status: varchar('status', { length: 20 }).notNull().default('scheduled'),
}, (table) => ({
  pk: primaryKey(table.date, table.time),
}));

export const Profile = mysqlTable('profile', {
  userId: int('user_id').primaryKey().notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 20 }).notNull(),
  address: varchar('Address', { length: 255 }).notNull(),
  country: varchar('Country', { length: 100 }).notNull(),
  zipCode: varchar('ZipCode', { length: 20 }).notNull(),
  gender: varchar('Gender', { length: 20 }).notNull(),
});

export const contacts = mysqlTable('contacts', {
  from: int('from')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  to: int('to').notNull(),
});

export const messages = mysqlTable('messages', {
  from: int('from')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  to: int('to').notNull(),

  message: varchar('message', { length: 1000 }).notNull(),

  date: varchar('date', { length: 20 }).notNull(),
});

export const feedbackTable = mysqlTable('feedback', {
  date: varchar('date', { length: 20 }).notNull(),
  time: varchar('time', { length: 20 }).notNull(),
  feedback: varchar('feedback', { length: 1000 }).notNull(),
}, (table) => ({
  pk: primaryKey(table.date, table.time),
}));

// Type inference
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export type InsertProfile = typeof Profile.$inferInsert;
export type SelectProfile = typeof Profile.$inferSelect;

export type InsertFeedback = typeof feedbackTable.$inferInsert;
export type SelectFeedBack = typeof feedbackTable.$inferSelect;

export type InsertContacts = typeof contacts.$inferInsert;
export type SelectContacts = typeof contacts.$inferSelect;

export type InsertMessages = typeof messages.$inferInsert;
export type SelectMessages = typeof messages.$inferSelect;
