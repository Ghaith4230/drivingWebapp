import { NextResponse } from 'next/server';
import { encryptPassword } from '@/app/lib/encryptio'; 
import { createUser } from '@/db/queries/insert';

export async function POST(req: Request) {
  try {
    const { email, password }: { email: string, password: string } = await req.json();
    
    // Wait for the encryption to resolve
    const encryptedPassword = await encryptPassword(password);

    const userData = {
      email: email, 
      password: encryptedPassword,
      id: Math.floor(Math.random() * 9000),
    };

  
    await createUser(userData);

   
    return NextResponse.json({ encryptedPassword: encryptedPassword });
  } catch (error) {
    console.error("Error during encryption:", error); // Log for debugging
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
