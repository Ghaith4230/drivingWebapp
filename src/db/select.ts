import { eq } from 'drizzle-orm';
import { db } from './index';
import { SelectUser, usersTable ,postsTable} from './schema';

// Get user by email - returns a single user object
export async function getUserByEmail(email: SelectUser['email']): Promise<{
  id: number;
  email: string;
  password: string;
  verificationToken: string | null;
  isVerified: boolean;
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

export async function getTimeSlotsByDate(date: string) {
  return await db.select().from(postsTable).where(eq(postsTable.date, date));
}


