import { NextRequest, NextResponse } from "next/server";
import { getTimeSlotsByDate } from "@/db/select";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { current } = await body;

    const allSlots = [];
    for (const date of current) {
      const slots = await getTimeSlotsByDate(date.toString());
      const cleanedSlots = slots.map(({ date, time, endTime, location, content }) => ({ date, time, endTime, location, content }));
      allSlots.push({ date, slots: cleanedSlots });
    }
    const response = allSlots.map(({ date, slots }) => ({ date, slots }));
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

