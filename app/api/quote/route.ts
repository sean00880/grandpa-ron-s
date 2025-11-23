
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      address,
      propertySize,
      services,
      additionalInfo,
      urgency,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !propertySize || !services) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const quote = await prisma.quote.create({
      data: {
        name,
        email,
        phone,
        address,
        propertySize,
        services: Array.isArray(services) ? services : [services],
        additionalInfo: additionalInfo || null,
        urgency: urgency || 'flexible',
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      message: 'Quote request submitted successfully',
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
