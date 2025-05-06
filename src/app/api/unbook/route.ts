import { NextResponse } from "next/server";
import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        // Parse incoming request body; we expect the composite key fields.
        const { date, time } = await req.json();

        // Retrieve and decrypt the session cookie.
        const cookie = (await cookies()).get("session")?.value;
        const session = await decrypt(cookie);
        const userId = session?.userId;

        if (!userId) {
            return NextResponse.json(
                { message: "User not authorized." },
                { status: 401 }
            );
        }

        const result = await db
            .update(postsTable)
            .set({ bookedBy: 0 })
            .where(
                sql`${postsTable.date} = ${date} AND ${postsTable.time} = ${time} AND ${postsTable.bookedBy} = ${userId}`
            );

        if (!result) {
            return NextResponse.json(
                { message: "Timeslot not found or you are not authorized to unbook this slot." },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "Timeslot unbooked successfully." });
    } catch (error) {
        console.error("Error during unbooking:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
