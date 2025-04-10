import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/db/select';
import { decrypt } from '@/app/lib/session';
import { bookTime } from '@/db/queries/insert';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { date, time,details }: { date: string; time: string,details : string } = await req.json();

    // Retrieve and decrypt the session cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

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
    };
    
    // Insert the booking into the database
    await bookTime(userData);

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