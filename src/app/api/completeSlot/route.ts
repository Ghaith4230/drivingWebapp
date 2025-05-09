// src/app/api/completeSlot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { completeTimeSlot, updateTimeSlot } from "@/db/queries/insert";
import { getTimeSlotsByDate } from "@/db/select";

export async function POST(req: NextRequest) {
    const { date, time, role } = (await req.json()) as {
        date: string;
        time: string;
        role: string;
    };

    if (role !== "faculty") {
        return NextResponse.json(
            { error: "Only faculty may mark slots completed/uncompleted." },
            { status: 403 }
        );
    }

    // 1) Fetch that single slot so we know its current status and bookedBy
    const slots = await getTimeSlotsByDate(date);
    const slot = slots.find((s) => s.time === time);
    if (!slot) {
        return NextResponse.json(
            { error: "Timeslot not found." },
            { status: 404 }
        );
    }

    let newStatus: "scheduled" | "booked" | "completed";
    if (slot.status === "completed") {
        // undo completion: go back to booked if someone had booked it, otherwise scheduled
        newStatus = slot.bookedBy ? "booked" : "scheduled";
        await updateTimeSlot(date, time, { status: newStatus });
    } else {
        // mark as completed
        newStatus = "completed";
        await completeTimeSlot(date, time);
    }

    return NextResponse.json({ ok: true, status: newStatus });
}
