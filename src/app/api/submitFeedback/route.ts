import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable, postsTable, feedbackTable, messages, InsertMessages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    // 1) Pull payload
    const { date, time, feedback: fb } = (await req.json()) as {
        date: string;
        time: string;
        feedback: string;
    };

    // 2) Decrypt session cookie to get userId (may be string or number)
    const sessionCookie = (await cookies()).get("session")?.value;
    const session = (await decrypt(sessionCookie)) as
        | { userId?: string | number }
        | null;
    if (!session?.userId) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    // 2a) Coerce userId to number
    const rawId = session.userId;
    const userId =
        typeof rawId === "string"
            ? parseInt(rawId, 10)
            : rawId;
    if (Number.isNaN(userId)) {
        return NextResponse.json(
            { error: "Invalid session userId" },
            { status: 401 }
        );
    }

    // 3) Look up the user's role in the DB
    const [user] = await db
        .select({ role: usersTable.role })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .all();

    if (!user || user.role !== "faculty") {
        return NextResponse.json(
            { error: "Only faculty can send feedback" },
            { status: 403 }
        );
    }
    const facultyId = userId;

    // 4) Find who booked the slot
    const [slot] = await db
        .select({ bookedBy: postsTable.bookedBy })
        .from(postsTable)
        .where(
            and(
                eq(postsTable.date, date),
                eq(postsTable.time, time)
            )
        )
        .all();

    if (!slot?.bookedBy) {
        return NextResponse.json(
            { error: "This slot is not booked by anyone" },
            { status: 400 }
        );
    }
    const studentId = slot.bookedBy;

    // 5) Upsert feedback
    await db
        .insert(feedbackTable)
        .values({ date, time, feedback: fb })
        .onConflictDoUpdate({
            target: [feedbackTable.date, feedbackTable.time],
            set: { feedback: fb },
        });

    // 6) Send notification message
    await db
        .insert(messages)
        .values({
            from: facultyId,
            to: studentId,
            message: `Feedback for your ${date} @ ${time}: ${fb}`,
            date: new Date().toISOString(),
        } as InsertMessages);

    return NextResponse.json({ ok: true });
}
