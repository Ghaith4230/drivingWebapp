import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import {cookies} from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        const session = await decrypt(cookie);
        const userId = session?.userId as number;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { startTime, endTime, title, date, location } = body;

        // 1. Validate required fields
        if (!startTime || !endTime || !title || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("This is the userID:" + userId);

        await db.insert(postsTable).values({
            date: date,
            time: startTime,
            userId: userId,
            content: title,
            endTime: endTime,
            location: location,
            bookedBy: 0,
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