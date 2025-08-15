// app/api/auth/route.ts

import { NextResponse } from 'next/server';
import { getUserByEmail } from "../../../db/select"; // Adjust path if necessary
import { comparePasswords } from "../../lib/encryptio";
import { createSession } from "../../lib/session"; // Adjust path if necessary
import { deleteSession } from '../../lib/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Fetch the user from the database by email
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({ message: "Error: email or password incorrect" }, { status: 400 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await comparePasswords(password, user.password);

    if (!user.isVerified) {
      return NextResponse.json({ message: "Error: Verify email" }, { status: 400 });
    }
    
    if (!passwordMatch) {
      return NextResponse.json({ message: "Error: email or password incorrect" }, { status: 400 });
    }

    // Create session for the user
    await createSession(user.email, user.id);

    // Send a success response
    return NextResponse.json({ message: "Login successful" });
  } catch (e) { // Renamed error to `e` if you want to log or inspect it later
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Call deleteSession with no arguments
    await deleteSession();

    // Send a success response
    return NextResponse.json({ message: "Logout successful" });
  } catch (e) { // Renamed error to `e`
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
