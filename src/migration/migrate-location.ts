import { db } from "@/db";
import { sql } from "drizzle-orm";

async function addLocationColumn() {
  try {
    await db.run(sql`ALTER TABLE timeslots ADD COLUMN location TEXT NOT NULL DEFAULT '';`);
    console.log("Column 'location' added successfully.");
  } catch (error) {
    console.error("Error adding column 'location':", error);
  }
}

addLocationColumn();
