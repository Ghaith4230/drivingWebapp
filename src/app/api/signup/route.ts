import { NextResponse } from 'next/server';
import { encryptPassword } from '@/app/lib/encryptio'; // Assuming encryptPassword is async
import { createUser } from '@/db/queries/insert';

export async function POST(req: Request) {
  try {
    const { email, password }: { email: string, password: string } = await req.json();
    
    // Wait for the encryption to resolve
    const encryptedPassword = await encryptPassword(password);

    const userData = {
      email: email, 
      password: encryptedPassword, // Now we use the encrypted password
      id: Math.floor(Math.random() * 9000),
    };

    // Await createUser to make sure the user is created
    await createUser(userData);

    // Return the encrypted password (although you may not want to return this for security reasons)
    return NextResponse.json({ encryptedPassword: encryptedPassword });
  } catch (error) {
    console.error("Error during encryption:", error); // Log for debugging
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
