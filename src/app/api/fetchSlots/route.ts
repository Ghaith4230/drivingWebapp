import { NextApiRequest, NextApiResponse } from "next";
import { getTimeSlotsByDate } from "@/db/queries/select";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { date } = req.query;
  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Invalid or missing date parameter" });
  }

  try {
    
    

    return res.status(200).json("e");
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
