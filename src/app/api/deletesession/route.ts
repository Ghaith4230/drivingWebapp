import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/lib/session';

export async function POST(req: Request) {
    try {
   
       await deleteSession();
    
      return NextResponse.json({ message: "session deleted" });
    } catch (error) {
      console.error("Error during encryption:", error); // Log error
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  
 