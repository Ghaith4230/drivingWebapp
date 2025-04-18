import { db } from "@/db";
import { sql } from 'drizzle-orm';

async function addEndTimeColumn() {
    try {
        await db.run(sql`ALTER TABLE timeslots ADD COLUMN endTime TEXT NOT NULL DEFAULT '';`);
        console.log("Column 'endTime' added successfully.");
    } catch (error) {
        console.error("Error adding column 'endTime':", error);
    }
}

addEndTimeColumn();
