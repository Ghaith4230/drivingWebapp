import { getUserByEmail } from '@/db/select'; // wherever your server code lives
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await getUserByEmail(email);
  return NextResponse.json({ exists: !!user });
}