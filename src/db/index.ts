// db/index.ts
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';

const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',         // ⬅️ your DB username
  password: 'Hetisklaar4230', // ⬅️ your DB password
  database: 'myappdb',    // ⬅️ your DB name
});

export const db = drizzle(pool, {
  schema,
  mode: 'default', // ⬅️ required!
});
