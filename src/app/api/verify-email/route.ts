import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '../../../db/select';
import { updateUser } from '../../../db/queries/insert';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  try {
    // Extract the query parameters from the URL
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    // Check for missing email or token
    if (!email || !token) {
      return NextResponse.json({ message: "Invalid arguments" }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    // Mark email as verified
    await updateUser(user!.id, { isVerified: 1, verificationToken: null });

    // Optionally, redirect after successful verification
    return redirect("/login");

  } catch (error) {
    console.error("Error during email verification:", error); // Log the detailed error
    return NextResponse.json({ message: "Error during verification" }, { status: 500 });
  }
}
