import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { format, addMinutes, startOfWeek, addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Placeholder
const getCurrentUserId = () => 1;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            startTime,
            endTime,
            title,
            location,
            description,
        } = body;

        const userId = getCurrentUserId();

        await db.delete(postsTable).where(eq(postsTable.userId, userId));

        const interval = 90;
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1});

        const insertData = [];

        for (let i = 0; i < 7; i++) {
            const dateObj = addDays(monday, i);
            const date = format(dateObj, "yyyy-MM-dd");

            let current = new Date(`1970-01-01T${startTime}:00`);
            const end = new Date(`1970-01-01T${endTime}:00`);

            while (current < end) {
                const time = format(current, "hh:mm a");

                insertData.push({
                    date,
                    time,
                    content: title,
                    userId,
                    location,
                    description,
                });

                current = addMinutes(current, interval);
            }
        }

        await db.insert(postsTable).values(insertData);

        return NextResponse.json({ message: "Availability updated!" });
    } catch (error) {
        console.error("Error managing availability:", error);
        return NextResponse.json({ error: "Failed to update availability!" }, { status: 500});
    }
}

async function handleAvailabilitySubmit() {
    try {
        const response = await fetch("/api/manageAvailability", {
            method: "POST",
            headers: { "Content-type": "application/json "},
            body: JSON.stringify({
                startTime: availabilityForm.startTime,
                endTime: availabilityForm.endTime,
                title: availabilityForm.title,
                location: availabilityForm.location,
                description: availabilityForm.description,
            }),
        });

        if (!response.ok) throw new Error("Failed to update availability!");

        setAvailabilityOpen(false);
        window.location.reload();
    } catch (error) {
        console.error("Availability update error:", error);
        alert("Something went wrong while updating your availability!");
    }
}