import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export async function GET() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        return NextResponse.json({ userId: null, role: null });
    }
    return NextResponse.json({
        userId: session?.userId ?? null,
        role:   session?.role   ?? null,
    });
}