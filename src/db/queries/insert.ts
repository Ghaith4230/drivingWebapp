import { db } from '../index';
import { InsertUser, usersTable ,Profile,postsTable,InsertPost,InsertProfile, InsertMessages,messages} from '../schema';
import {and, eq, sql} from 'drizzle-orm';

interface InsertTimeSlot {
  date: string;
  time: string;
  userId: number;
  content: string;
  endTime: string;
  location: string;
  bookedBy?: number;
  status?: 'scheduled' | 'booked' | 'completed';
}

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  await db
      .update(usersTable)
      .set(data)
      .where(sql`${usersTable.id} = ${id}`); // Use SQL template for equality
}
export async function bookTime(data: InsertPost) {
  await db.insert(postsTable).values(data);
}


export async function createProfile(data: InsertProfile) {
  await db.insert(Profile).values(data);
}

export async function addMessage(data: InsertMessages) {
  await db.insert(messages).values(data);
}


export async function updateTimeSlot(
    date: string, // The date part of the composite key
    time: string, // The time part of the composite key
    data: Partial<InsertTimeSlot> // The data to update
) {
  await db
      .update(postsTable) // Update the 'timeslots' table
      .set(data) // Set the new data to update
      .where(sql`${postsTable.date} = ${date} AND ${postsTable.time} = ${time}`); // Composite key condition
}

export async function completeTimeSlot(date: string, time: string) {
  await db.update(postsTable).set({ status: 'completed'}).where(and(eq(postsTable.date, date), eq(postsTable.time, time),));
}

