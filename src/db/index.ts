import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' }); // or .env.local

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL || "libsql://training-ghaith4230.turso.io" ,
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDA0MzQxMDgsImlkIjoiOGRhYzQ0MjctMmMwNC00ZDA4LTlkNzYtYWM1NDJiN2E4Yzk3In0.LPbLtKRwNYwtsvjm-RT7W6TmFUCsqTKa6LhbQbYEhTx2pcxvQyysJjDV46nFAVklyUmdNa-pFfOKbbyKh4nOCg",
}});
