import { NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ message: "No session cookie found" }, { status: 401 });
    }

    const session = await decrypt(cookie);

    if (!session) {
      return NextResponse.json({ message: "Invalid or expired session" }, { status: 401 });
    }

    // Send a success response
    return NextResponse.json({ message: session.userId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
