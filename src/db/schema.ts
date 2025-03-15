import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text} from 'drizzle-orm/sqlite-core';


export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  verificationToken: text('verification_token'),
  isVerified: integer('is_verified').default(0).notNull(), 
});

export const postsTable = sqliteTable('timeslots', {
  date: text('date')
    .$onUpdate(() => new Date().toISOString().split('T')[0])
    .notNull(),

  time: text('time').notNull(),

  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),
  
}, (table) => ({
  pk: primaryKey(table.date, table.time) // Composite primary key
}));

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
