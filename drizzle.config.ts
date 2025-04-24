import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",

    out: "./drizzle",

    driver: "./src/db/index.ts",

    dbCredentials: {
        url: "file:./driving.db"
    }
});
