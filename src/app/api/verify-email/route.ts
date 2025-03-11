import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { getUserByEmail } from '../../../db/queries/select';
import { updateUser } from '../../../db/queries/insert';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract the query parameters from the URL
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    console.log(email)
    console.log(token)

    // Check for missing email or token
    if (!email || !token) {
      return NextResponse.json({ message: "Invalid arguments" }, { status: 400 });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    // Mark email as verified
    await updateUser(user[0].id, { isVerified: 1, verificationToken: null });

    return NextResponse.json({ message: "Email verified" }, { status: 200 });
  
  } catch (error) {
    console.error("Error during email verification:", error); // Log the detailed error
    
  }
}
