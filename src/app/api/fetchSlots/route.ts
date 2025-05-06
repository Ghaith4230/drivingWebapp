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

      // Filter the slots to only include those with the bookedBy being the same as userId or null
      const filteredSlots = slots.filter(slot => slot.bookedBy === userId || slot.bookedBy === 0);

      console.log("Filtered Slots:", filteredSlots); 
      const cleanedSlots = filteredSlots.map(({ date, time, endTime, location, content, bookedBy }) => ({
        date, time, endTime, location, content, bookedBy
      }));

      allSlots.push({ date, slots: cleanedSlots });
    }

    // Return the response with the filtered slots
    return NextResponse.json(allSlots, { status: 200 });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
