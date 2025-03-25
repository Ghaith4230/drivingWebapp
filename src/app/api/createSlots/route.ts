import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { InsertPost } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

// Placeholder setter for userId
const getCurrentUserId = () => 1;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { date, slots } = body;

        const userId = getCurrentUserId();

        if (!date || !slots || !Array.isArray(slots)) {
            return NextResponse.json({ error: "Invalid input!" }, { status: 400});
        }

        const insertData: InsertPost[] = slots.map((slot) => ({
            date,
            time: slot.time,
            content: slot.content,
            userId,
        }));

        await db.insert(postsTable).values(insertData);

        return NextResponse.json({ message: "Slots created!"}, {status: 200});
    } catch (error) {
        console.error("Error creating slots:", error);
        return NextResponse.json({ error: "Failed to create slots" }, { status: 500});
    }
}