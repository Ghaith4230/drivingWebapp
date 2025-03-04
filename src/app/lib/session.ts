import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Generate the secret key directly as a raw Uint8Array (64 bytes)
const secretKey = new TextEncoder().encode('my-static-secret-key'); // Raw bytes used directly

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  console.log("Created Session:", session);

  // Await the cookies call before using set
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  // Await the cookies call before using delete
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.set("session", "", { expires: new Date(0) });
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  console.log("Signing JWT with payload:", payload);
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d");

  const signedJWT = await jwt.sign(secretKey); 

  console.log("Signed JWT:", signedJWT); 
  return signedJWT;
}

export async function decrypt(session: string | undefined = "") {
  console.log("Decrypting session:", session); 

  if (!session) {
    console.log("No session found");
    return undefined;
  }

  try {
    // Use the raw secretKey for verifying the JWT
    const { payload } = await jwtVerify(session, secretKey, {
      algorithms: ["HS256"],
    });

    console.log("Decrypted payload:", payload); // Log the decrypted payload for debugging
    return payload;
  } catch (error) {
    console.log("Failed to verify session:", error); // Log the error to get more details
    return undefined;
  }
}
