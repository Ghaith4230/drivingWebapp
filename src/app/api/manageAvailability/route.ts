import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { format, addMinutes, startOfWeek, addDays } from "date-fns";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession(req);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { startTime, endTime, title, date, location, description } = body;

        // 1. Validate required fields
        if (!startTime || !endTime || !title || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Build insertData from startTime -> endTime (single day)
        const interval = 90; // minutes
        const insertData = [];

        let current = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        while (current < end) {
            const time = format(current, "hh:mm a");
            insertData.push({
                date,
                time,
                content: title,
                userId,
                location: location || "",
                description: description || "",
            });

            current = addMinutes(current, interval);
        }

        if (insertData.length === 0) {
            return NextResponse.json({ error: "No time slots generated" }, { status: 400 });
        }

        // 3. Clear previous entries for *this user & this date*
        await db.delete(postsTable).where(
            and(eq(postsTable.userId, userId), eq(postsTable.date, date))
        );

        // 4. Insert new ones
        await db.insert(postsTable).values(insertData);

        return NextResponse.json({ message: "Availability updated!" });
    } catch (error: any) {
        console.error("❌ Error managing availability:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update availability" },
            { status: 500 }
        );
    }
}