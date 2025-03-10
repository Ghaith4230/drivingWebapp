  import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL || "libsql://training-ghaith4230.turso.io", 
    authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDE2MzgzMjEsImlkIjoiOGRhYzQ0MjctMmMwNC00ZDA4LTlkNzYtYWM1NDJiN2E4Yzk3In0.gPrensioY4cDvk2buenXro6kf8klXLJiQnOxSIl8f73AkXAexzcoWhdeIyHrjOIrvz-BMwEI10gWR9OUaVeeBg ",
}
});

