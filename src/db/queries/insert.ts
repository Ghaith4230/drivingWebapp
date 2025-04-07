import { db } from '../index';
import {InsertPost, InsertUser, postsTable, usersTable} from '../schema';
import { sql } from 'drizzle-orm';

interface InsertTimeSlot {
  date: string;
  time: string;
  userId: number;
  content: string;
  endTime: string;
  location: string;
  bookedBy?: number;
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