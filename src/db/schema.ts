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
    .notNull(),

  time: text('time').notNull(),

  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),


  endTime: text('endTime').notNull(),

  location: text('location').notNull(),

  bookedBy: integer('booked_by'),
  

}, (table) => ({
  pk: primaryKey(table.date, table.time) // Composite primary key
}));


  export const Profile = sqliteTable('Profile', {
    userId: integer('user_id')
    .notNull().primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(), 
    phoneNumber: text('phoneNumber').notNull(),
    address: text('Address').notNull(),
    country: text('Country').notNull(),
    zipCode: text('ZipCode').notNull(),
    gender: text('Gender').notNull(),
  });

  
  export const contacts = sqliteTable('contacts', {
    from: integer('from')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
    to: integer('to').notNull(),
  });

  export const messages = sqliteTable('messages', {
    from: integer('from')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
    to: integer('to').notNull(),
    message: text('message').notNull(),
    date: text('date').notNull(), 
  });


  export const feedbackTable = sqliteTable('feedback', {
    date: text('date')
      .notNull(),
  
  
    time: text('time')
      .notNull(),
      
  
    feedback: text('feedback').notNull(),
  }, (table) => ({
    pk: primaryKey(table.date, table.time),
  }));



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