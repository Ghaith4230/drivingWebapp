import { getContacts, getMessages } from '@/db/select'; // Make sure these functions are properly defined in your `select` module
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the incoming request body (it should be JSON)
    const { userId } = await req.json();

    // Ensure we have a valid userId
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch contacts for the given userId
    const contacts = await getContacts(parseInt(userId));
    const messages: { [key: number]: any[] } = {};

    // Fetch messages for each contact
    for (const c of contacts) {
      const msgs = await getMessages(c.from, c.to);
      messages[c.to] = msgs;
    }

    // Return the contacts and their associated messages
    return NextResponse.json({ contacts, messages });
  } catch (error) {
    console.error('Error fetching contacts and messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
