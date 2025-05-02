import { or,and, eq } from 'drizzle-orm';
import { db } from './index';
import { SelectUser, usersTable ,postsTable,Profile,SelectFeedBack,feedbackTable,contacts, messages } from './schema';

// Get user by email - returns a single user object
export async function getUserByEmail(email: SelectUser['email']): Promise<{
  id: number;
  email: string;
  password: string;
  verificationToken: string | null;
  isVerified: boolean;
  role: string;
} | null> {
  const users = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  // Return null if no user found, otherwise map to the correct format
  if (users.length === 0) {
    return null;
  }

  const user = users[0];
  return {
    ...user,
    isVerified: Boolean(user.isVerified), // Ensure isVerified is a boolean
  };
}


export async function getUserById(id: SelectUser['id']): Promise<{
  id: number;
  email: string;
  password: string;
  verificationToken: string | null;
  isVerified: boolean;
  role: string;
} | null> {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

  // Return null if no user found, otherwise map to the correct format
  if (users.length === 0) {
    return null;
  }

  const user = users[0];
  return {
    ...user,
    isVerified: Boolean(user.isVerified), // Ensure isVerified is a boolean
  };
}

export async function getProfileByUserId(userId: number): Promise<{
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  country: string;
  zipCode: string;
  gender: string;
} | null> {
  const profiles = await db.select().from(Profile).where(eq(Profile.userId, userId)).limit(1);

  // Return null if no profile found, otherwise map to the correct format
  if (profiles.length === 0) {
    return null;
  }

  const profile = profiles[0];
  return {
    ...profile,
  };
}

export async function getTimeSlotsByDate(date: string) {
  return await db.select().from(postsTable).where(eq(postsTable.date, date));
}



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


export async function getContacts(userId: number): Promise<{
  from: number;
  to: number;
}[]> {
  const profiles = await db
    .select()
    .from(contacts)
    .where(eq(contacts.from, userId));

  return profiles;
}

export async function getMessages(from: number, to: number): Promise<{
  from: number;
  to: number;
  message: string;
  date: string;
}[]> {
  const messagesList = await db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.from, from), eq(messages.to, to)),
        and(eq(messages.from, to), eq(messages.to, from))
      )
    );

  return messagesList;
}
export async function getBookedLessonsByUserId(userId: number): Promise<{
  date: string;
  time: string;
  endTime: string;
  location: string;
  content: string;
}[]> {
  const lessons = await db
    .select({
      date: postsTable.date,
      time: postsTable.time,
      endTime: postsTable.endTime,
      location: postsTable.location,
      content: postsTable.content,
    })
    .from(postsTable)
    .where(eq(postsTable.bookedBy, userId));

  return lessons;
}