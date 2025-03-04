import { NextResponse } from 'next/server';
import { encryptPassword } from '@/app/lib/encryptio';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Encrypt the password
    const encryptedPas = encryptPassword(password);

    // Return the encrypted password with the correct key
    return NextResponse.json({ encryptedPassword: encryptedPas });
  } catch (error) {
    console.error("Error during encryption:", error); // Log for debugging
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
