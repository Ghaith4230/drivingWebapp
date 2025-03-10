import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '../../../db/queries/select';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, token } = req.query;

  if (!userId || !token) {
    return res.status(400).json({ message: "Missing user ID or token" });
  }

    const userIdnumb = Number(userId);
  // Find user by ID
  const user = await getUserById(userIdnumb);

  if (!user || user.verficationToken !== token) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Mark email as verified
  await db.user.update({
    where: { id: userId },
    data: { emailVerified: true, verificationToken: null },
  });

  res.status(200).json({ message: "Email verified successfully" });
}
