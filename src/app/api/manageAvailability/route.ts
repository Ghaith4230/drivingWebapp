import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { format, addMinutes, startOfWeek, addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Placeholder
const getCurrentUserId = () => 1;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slots } = body;

        const session = await getSession(req);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        if (!Array.isArray(slots) || slots.length === 0) {
            console.log("⚠️ No slots received from client.");
            return NextResponse.json({ error: "No slots to insert." }, { status: 400 });
        }

        // Clean out existing slots for the user first
        await db.delete(postsTable).where(eq(postsTable.userId, userId));

        // Map received slot data into DB format
        const insertData = slots.map((slot: any) => ({
            date: slot.date,
            time: slot.time,
            content: slot.content || "Lesson",
            location: slot.location || "",
            description: slot.description || "",
            userId,
        }));

        if (insertData.length === 0) {
            return NextResponse.json({ error: "No time slots were generated" }, { status: 400 });
        }

        console.log("✅ Inserting", insertData.length, "slots...");
        await db.insert(postsTable).values(insertData);

        return NextResponse.json({ message: "Availability updated!" });
    } catch (error: never) {
        console.error("❌ Error managing availability:", error);
        return NextResponse.json(
            { error: error?.message || "Unknown server error" },
            { status: 500 }
        );
    }
}