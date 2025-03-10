import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';
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