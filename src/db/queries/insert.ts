import { db } from '../index';
import { InsertUser, usersTable ,Profile,postsTable,InsertPost,InsertProfile} from '../schema';
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

export async function createProfile(data: InsertProfile) {
  await db.insert(Profile).values(data);
}


