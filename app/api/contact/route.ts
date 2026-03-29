
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/orcbase';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Optional auth: capture user identity when available
    const session = await validateRequest(request);

    const body = await request.json();

    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await db.contacts.create({
      name,
      email,
      subject: subject || null,
      message,
      status: 'new',
    });

    return NextResponse.json({
      success: true,
      contactId: contact.id,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
