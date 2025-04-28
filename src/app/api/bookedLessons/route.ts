import { NextResponse } from "next/server";
import { getBookedLessonsByUserId } from "@/db/select";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export async function POST(req: Request) {
  try {
    // Get session from cookie
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userId = session?.userId as number;

    if (!userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    // Fetch the lessons for this user
    const lessons = await getBookedLessonsByUserId(userId);

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching booked lessons:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}