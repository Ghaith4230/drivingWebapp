import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: "libsql://training-ghaith4230.aws-eu-west-1.turso.io",
    authToken:"eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUxNDA3MjgsImlkIjoiOGRhYzQ0MjctMmMwNC00ZDA4LTlkNzYtYWM1NDJiN2E4Yzk3IiwicmlkIjoiNjE5NzBmNWQtNWY1MS00NGY4LTk5OTgtMDExYjc5OWRlMGYzIn0.b1ccwVuCVKP9Lksp556wjaKp_t0U8KxNxRn_W1DgCm9nnwcq0P49MPxl52IM62KOFeJrZlAULT3VxuS14nD5AQ",
  },
});