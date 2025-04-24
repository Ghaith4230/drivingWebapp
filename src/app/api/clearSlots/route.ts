import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession(req);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await db.delete(postsTable).where(eq(postsTable.userId, userId));

        return NextResponse.json({ message: "All slots cleared" }, { status: 200 });
    } catch (error) {
        console.error("Error clearing slots:", error);
        return NextResponse.json({ error: "Failed to clear slots" }, { status: 500 });
    }
}
