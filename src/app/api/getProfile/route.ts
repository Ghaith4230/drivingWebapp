import { NextRequest, NextResponse } from "next/server";
import { getProfileByUserId } from '@/db/select'; // Adjust this import based on where you have this function

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // Extract userId from the request body

    // Check if the userId is valid
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    // Call getProfileByUserId function to get the profile data
    const profile = await getProfileByUserId(parsedUserId);
    console.log('Profile data:', profile);

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Return the profile data in the response
    return NextResponse.json({ profile });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
