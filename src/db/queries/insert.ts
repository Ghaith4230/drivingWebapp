import { db } from '../index';
import { InsertUser, usersTable ,postsTable,InsertPost} from '../schema';
import { sql } from 'drizzle-orm';

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
