// app/api/create-profile/route.ts
import { NextResponse ,NextRequest} from 'next/server';
import { createProfile } from '@/db/queries/insert';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Perform validation or other processing if needed
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Call the createProfile function
    await createProfile(formData);

    return NextResponse.json({ message: 'Profile created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ message: 'Failed to create profile' }, { status: 500 });
  }
}
