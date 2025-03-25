import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Placeholder setter for userId
const getCurrentUserId = () => 1;

export async function POST(req: NextRequest) {
    const userId = getCurrentUserId();

    try {
        await db.delete(postsTable).where(eq(postsTable.userId, userId));
        return NextResponse.json({ message: "Slots cleated!" }, { status: 200});
    } catch (error) {
        console.error("Error clearing slots:", error);
        return NextResponse.json({ error: "Failed to clear slots" }, { status: 500});
    }
}
