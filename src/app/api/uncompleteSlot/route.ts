import { NextRequest, NextResponse} from "next/server";
import {and, eq} from "drizzle-orm";
import {postsTable} from "@/db/schema";
import {db} from "@/db";

export async function POST(req: NextRequest) {
    const { date, time, role} = (await req.json()) as {
        date: string;
        time: string;
        role: string;
    };

    console.log("[uncompleteSlot] payload:", { date, time, role });

    if (role !== "faculty") {
        console.log("[uncompleteSlot] rejected — not faculty");
        return NextResponse.json(
            { error: "Only faculty may un-complete slots!"},
            { status: 403 }
        );
    }

    const updateResult = await db
        .update(postsTable)
        .set({ status: "scheduled" })
        .where(and(eq(postsTable.date, date), eq(postsTable.time, time)));
    console.log("[uncomplete] updateResult:", updateResult);

 const [row] = await db
    .select({ status: postsTable.status })
    .from(postsTable)
    .where(and(eq(postsTable.date, date), eq(postsTable.time, time)));
    console.log("[uncomplete] row after:", row);

    return NextResponse.json({ ok: true, statusNow: row?.status });
}