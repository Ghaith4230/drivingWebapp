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
        const { startTime, endTime, title, date, location } = body;

        // 1. Validate required fields
        if (!startTime || !endTime || !title || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await db.insert(postsTable).values({
            date,
            time: startTime,
            endTime: endTime,
            content: title,
            userId,
            location: location || "",
        });

        return NextResponse.json({ message: "Availability updated!" });
    } catch (error: any) {
        console.error("❌ Error managing availability:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to update availability" },
            { status: 500 }
        );
    }
}