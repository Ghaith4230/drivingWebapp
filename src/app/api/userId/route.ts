// app/api/auth/route.ts.bak

import { NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
export async function POST(req: Request) {
  try {
   
    const cookie = (await cookies()).get("session")?.value;
    

    const session = await decrypt(cookie);

    const userId =  await session.userId

    // Send a success response
    return NextResponse.json({ message: session.userId });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

