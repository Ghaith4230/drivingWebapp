import { NextResponse } from 'next/server';
import { getUserById } from '@/db/select'; // Adjust this import based on where you have this function

export async function POST(req: Request) {
  try {
    const { userId } = await req.json(); // Extract userId from the request body

    // Check if the userId is valid
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    // Call getUserById function to get the user data
    const user = await getUserById(parsedUserId);
    console.log('User data:', user);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user data in the response
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
