import { NextRequest, NextResponse } from "next/server";
import { getTimeSlotsByDate } from "@/db/select";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { current, userId } = body; // Extract current dates and userId from the request body

    const allSlots = [];

    // Iterate over each date in the 'current' array
    for (const date of current) {
      // Get the time slots for the given date
      const slots = await getTimeSlotsByDate(date.toString());
      const cleanedSlots = slots.map(({ date, time, endTime, location, content, bookedBy, status }) => ({ date, time, endTime, location, content, bookedBy, status }));
      allSlots.push({ date, slots: cleanedSlots });
    }
    const response = allSlots.map(({ date, slots }) => ({ date, slots }));
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
