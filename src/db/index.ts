import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' }); // or .env.local

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL || "libsql://training-ghaith4230.turso.io" ,
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDE2MzgzMjEsImlkIjoiOGRhYzQ0MjctMmMwNC00ZDA4LTlkNzYtYWM1NDJiN2E4Yzk3In0.gPrensioY4cDvk2buenXro6kf8klXLJiQnOxSIl8f73AkXAexzcoWhdeIyHrjOIrvz-BMwEI10gWR9OUaVeeBg",
}});
