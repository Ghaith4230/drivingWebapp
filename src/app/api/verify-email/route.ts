import { NextApiRequest, NextApiResponse } from 'next';
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
      return res.status(400).json({ message: "Missing email or token" });
    }

    // Find user by email
    const user = await getUserByEmail(email);


    // Mark email as verified
    await updateUser(377, { isVerified: 1, verificationToken: null });

  
  } catch (error) {
    console.error("Error during email verification:", error); // Log the detailed error
    
  }
}
