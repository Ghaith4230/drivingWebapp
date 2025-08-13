import { NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { updateTimeSlot } from "@/db/queries/insert";

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { date, time,details }: { date: string; time: string,details : string } = await req.json();

    // Retrieve and decrypt the session cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);
    const userId = session?.userId as number;

    // Check if the session is valid and contains a userId
    if (!session?.userId) {
      return NextResponse.json(
        { message: "User not found or session expired." },
        { status: 401 }
      );
    }

    // Prepare the data for booking
    const userData = {
      date: date,
      time: time,
      userId: session.userId as number, // Ensure this matches the field in your database
      content: details,
      endTime: "",
      location: "",
      bookedBy: null
    };

    console.log(userData.date)
    console.log(userData.time)
    console.log(userData.userId)
    
    // Insert the booking into the database
    await updateTimeSlot(
        userData.date, // The date of the timeslot (part of the composite key)
        userData.time, // The time of the timeslot (part of the composite key)
        { bookedBy: userId } // Only updating the 'bookedBy' field
    );

    // Return a success response
    return NextResponse.json({ message: "Time slot booked successfully." });
  } catch (error) {
    // Log the error for debugging
    console.error("Error during booking:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}