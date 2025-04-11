import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import nodemailer from 'nodemailer';
// Generate the secret key directly as a raw Uint8Array (64 bytes)
const secretKey = new TextEncoder().encode('my-static-secret-key'); // Raw bytes used directly

export async function createSession(userEmail: string, userId: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userEmail, userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ✅ Only secure in prod
    expires: expiresAt,
    sameSite: 'lax', // Recommended
    path: '/',       // Ensures it's sent on all routes
  });
}

export async function deleteSession() {
  // Await the cookies call before using delete
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.set("session", "", { expires: new Date(0) });
}

type SessionPayload = {
  userEmail: string;
  userId: number;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  console.log("Signing JWT with payload:", payload);
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d");

  const signedJWT = await jwt.sign(secretKey); 

  return signedJWT;
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | undefined> {
  if (!session) {
    console.log("No session found");
    return undefined;
  }

  try {
    const { payload } = await jwtVerify(session, secretKey, {
      algorithms: ["HS256"],
    });

    // Optional: You can validate fields more strictly here
    return {
      userEmail: payload.userEmail as string,
      userId: Number(payload.userId),
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch (error) {
    console.log("Failed to verify session:", error);
    return undefined;
  }
}






