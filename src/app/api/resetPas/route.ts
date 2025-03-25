import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/db/select';
import { encryptPassword } from '@/app/lib/encryptio';
import { updateUser } from '@/db/queries/insert';



export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { email, newPassword,token }: { email: string,newPassword: string, token: string} = await req.json();
    
    
   
    
    const user = await getUserByEmail(email);
    
    if(user?.verificationToken !== token){
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    const encryptedPassword = await encryptPassword(newPassword);
     
   
    updateUser(user!.id, { password: encryptedPassword, verificationToken: null });

    
    return NextResponse.json({ message: "password reset" });
  } catch (error) {
    console.error("Error during encryption:", error); // Log error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

