// app/api/auth/route.ts

import { NextResponse } from 'next/server';
import { getUserByEmail } from "../../../db/queries/select"; // Adjust path if necessary
import { comparePasswords } from "../../lib/encryptio";
import { createSession } from "../../lib/session"; // Adjust path if necessary
import { deleteSession } from '../../lib/session';
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log(email,password)
    // Fetch the user from the database by email
    const userArray = await getUserByEmail(email);

    console.log(userArray[0].email)
    

    if (userArray.length === 0) {
      return NextResponse.json({ message: "Error: email or password incorrect" }, { status: 400 });
    }

    const userData = userArray[0]; // Assuming the first match is the user

    // Compare the provided password with the stored hashed password
    const passwordMatch = await comparePasswords(password, userData.password);
    

    if (!passwordMatch) {
      return NextResponse.json({ message: "Error: email or password incorrect" }, { status: 400 });
    }

    // Create session for the user


    await createSession(userData.email);
  

    // Send a success response
    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Call deleteSession with no arguments
    await deleteSession();

    // Send a success response
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}