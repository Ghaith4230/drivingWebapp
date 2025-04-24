import { NextResponse } from 'next/server';
import { encryptPassword } from '@/app/lib/encryptio';
import { createUser } from '@/db/queries/insert';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, password, text }: { email: string; password: string; text: string } =
        await req.json();

    // Generate & hash a verification token
    const rawToken = uuidv4();
    const hashedToken = await hash(rawToken, 10);

    // Encrypt the password
    const encryptedPassword = await encryptPassword(password);

    // Prepare user record
    const userData = {
      email,
      password: encryptedPassword,
      verificationToken: hashedToken,
      isVerified: 0,  // or false, depending on your schema
    };
    await createUser(userData);

    // Send verification email
    await sendVerificationEmail(email, rawToken, text);

    return NextResponse.json({
      message: 'User created successfully. Check your email to verify.',
    });
  } catch (err) {
    console.error('Error during signup:', err);
    return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
    );
  }
}

async function sendVerificationEmail(
    email: string,
    token: string,
    subject: string
) {
  // Create transporter that ignores self‑signed certs
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Geoffjeff08@gmail.com',
      pass: 'aojk ynuk aswt pbjx',
    },
    tls: {
      // accept self‑signed certificates
      rejectUnauthorized: false,
    },
  });

  // Use a template literal so token and email actually interpolate
  const verifyLink = `http://localhost:3000/api/verify-email?token=${encodeURIComponent(
      token
  )}&email=${encodeURIComponent(email)}`;

  const html = `
    <p>Click the link below to verify your email:</p>
    <a href="${verifyLink}">Verify Email</a>
  `;

  await transporter.sendMail({
    to: email,
    subject,
    html,
  });
}
