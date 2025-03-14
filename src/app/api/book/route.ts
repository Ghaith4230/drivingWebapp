import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/db/queries/select';
import { decrypt } from '@/app/lib/session';
import { bookTime } from '@/db/queries/insert';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { date, time }: { date: string; time: string } = await req.json();

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

    // Fetch the user by email (or userId, depending on your implementation)
    const user = await getUserByEmail(session.userId as string);

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Log the user object for debugging
    console.log("User object:", user);

   

    // Prepare the data for booking
    const userData = {
      date: date,
      time: time,
      userId: 8473, // Ensure this matches the field in your database
      content: "Booked",
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