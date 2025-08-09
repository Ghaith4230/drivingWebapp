import { or, and, eq } from 'drizzle-orm';
import { db } from './index';
import {
  SelectUser, usersTable, postsTable, Profile,
  SelectFeedBack, feedbackTable, contacts, messages
} from './schema';


// ✅ Get user by email
export async function getUserByEmail(email: SelectUser['email']) {
  const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (users.length === 0) return null;

  const user = users[0];
  return {
    ...user,
    isVerified: Boolean(user.isVerified),
  };
}


// ✅ Get user by ID
export async function getUserById(id: SelectUser['id']) {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

  if (users.length === 0) return null;

  const user = users[0];
  return {
    ...user,
    isVerified: Boolean(user.isVerified),
  };
}


// ✅ Get profile by user ID
export async function getProfileByUserId(userId: number) {
  const profiles = await db.select().from(Profile).where(eq(Profile.userId, userId)).limit(1);

  return profiles.length > 0 ? profiles[0] : null;
}


// ✅ Get all timeslots by date
export async function getTimeSlotsByDate(date: string) {
  return db
    .select({
      date: postsTable.date,
      time: postsTable.time,
      endTime: postsTable.endTime,
      location: postsTable.location,
      content: postsTable.content,
      bookedBy: postsTable.bookedBy,
      status: postsTable.status,
    })
    .from(postsTable)
    .where(eq(postsTable.date, date));
}


// ✅ Get a feedback timeslot by date and time
export async function getTimeSlotByDateTime(
  date: SelectFeedBack['date'],
  time: SelectFeedBack['time']
): Promise<SelectFeedBack | null> {
  const result = await db
    .select()
    .from(feedbackTable)
    .where(and(eq(feedbackTable.date, date), eq(feedbackTable.time, time)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}


// ✅ Get contacts (users this user has contacted)
export async function getContacts(userId: number) {
  return db.select().from(contacts).where(eq(contacts.from, userId));
}


// ✅ Get messages between two users
export async function getMessages(from: number, to: number) {
  return db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.from, from), eq(messages.to, to)),
        and(eq(messages.from, to), eq(messages.to, from))
      )
    );
}


// ✅ Get all booked lessons by user ID
export async function getBookedLessonsByUserId(userId: number) {
  return db
    .select({
      date: postsTable.date,
      time: postsTable.time,
      endTime: postsTable.endTime,
      location: postsTable.location,
      content: postsTable.content,
    })
    .from(postsTable)
    .where(eq(postsTable.bookedBy, userId));
}
