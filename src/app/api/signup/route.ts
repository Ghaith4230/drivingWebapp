import { NextResponse } from 'next/server';
import { encryptPassword } from '@/app/lib/encryptio'; 
import { createUser } from '@/db/queries/insert';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import nodemailer from "nodemailer";
import { verify } from 'crypto';

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { email, password ,text }: { email: string, password: string, text : string} = await req.json();
    
    // Generate a unique token and hash it for security
    const rawToken = uuidv4(); 
    const hashedToken = await hash(rawToken, 10); 
    
    // Encrypt the password
    const encryptedPassword = await encryptPassword(password);

    
    const userData = {
      email: email, 
      password: encryptedPassword,
      id: Math.floor(Math.random() * 9000),  // You might want to change this logic to auto-increment
      verificationToken: hashedToken, 
      emailVerified: false,
    };

    // Save user to the database
    await createUser(userData);

    
    await sendM(email, rawToken , text);

    // Return response with encrypted password or a success message
    return NextResponse.json({ message: "User created successfully. Check your email to verify." });
  } catch (error) {
    console.error("Error during encryption:", error); // Log error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function sendM(email: string, token: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
      user: "Geoffjeff08@gmail.com", 
      pass: "aojk ynuk aswt pbjx",
    },
  });

  const verifyLink = `http://localhost:3000/api/verify-email?token=${token}&email=${email}`;
  ;

  await transporter.sendMail({
    to: email,
    subject: text,
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verifyLink}">Verify Email</a>`,
  });
}
