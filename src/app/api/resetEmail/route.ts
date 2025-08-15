import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/db/select';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { updateUser } from '@/db/queries/insert'; 


export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { email }: { email: string} = await req.json();
    
    // Generate a unique token and hash it for security
    const rawToken = uuidv4(); 
   
    
    const user = await getUserByEmail(email);
    await updateUser(user!.id, {  verificationToken: rawToken });
     
    await sendM(email,rawToken);
    

    // Return response with encrypted password or a success message
    return NextResponse.json({ message: "User created successfully. Check your email to verify." });
  } catch (error) {
    console.error("Error during encryption:", error); // Log error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function sendM(email: string, token: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
      user: "Geoffjeff08@gmail.com", 
      pass: "aojk ynuk aswt pbjx",
    },
    tls: {
      // <-- add this to accept self‑signed certificates
      rejectUnauthorized: false,
    },

  });

  
  ;

  await transporter.sendMail({
    to: email,
    subject: "reset code",
    html: `<p>The code to reset your password:</p>
           <h1>${token}</h1>`,
  });
}