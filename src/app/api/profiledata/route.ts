import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { getUserById, getProfileByUserId } from '@/db/select';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;

    console.log("Session cookie:", cookie);

    if (!cookie) {
      return NextResponse.json({ message: 'Unauthorized: No cookie' }, { status: 401 });
    }

    const session = await decrypt(cookie);
    console.log("Decrypted session:", session);

    const userId = session?.userId;

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ message: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    console.log("Fetching user and profile for userId:", userId);

    const user = await getUserById(userId);
    const profile = await getProfileByUserId(userId);

    if (!user) {
      console.log("User not found for userId:", userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!profile) {
      console.log("Profile not found for userId:", userId);
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      country: profile.country,
      zipCode: profile.zipCode,
      gender: profile.gender,
    });
  } catch (err) {
    console.error("Error in /profile API route:", err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}