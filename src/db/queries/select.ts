import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable,SelectPost } from '../schema';


export async function getUserByEmail(email: SelectUser['email']): Promise<
  Array<{
    id: number;
    email: string;
    password: string;
    verificationToken: string | null;
    isVerified: number;
  }>
> {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
}

export async function getTimeSlots(): Promise<
  { date: string; timestamp: number; userId: number; content: string }[] // Return type for the slots
> {
  try {
    // Query the postsTable (timeslots) to fetch all time slots
    const timeSlots = await db
      .select()
      .from(postsTable); // No filter applied, fetching all rows

    // Convert each row's timestamp to a Unix timestamp (number)
    const formattedTimeSlots = timeSlots.map(slot => ({
      ...slot,
      timestamp: (slot.timestamp instanceof Date) ? slot.timestamp.getTime() : slot.timestamp, 
    }));

    return formattedTimeSlots; 
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw new Error('Failed to fetch time slots');
  }
}
