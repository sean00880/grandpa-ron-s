
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import emailjs from '@emailjs/nodejs';

// Send email notification via EmailJS (server-side)
async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertySize: string;
  services: string[];
  additionalInfo?: string;
  urgency?: string;
}) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS not configured, skipping email notification');
    return;
  }

  const templateParams = {
    to_name: "Grandpa Ron's Team",
    from_name: data.name,
    from_email: data.email,
    phone: data.phone,
    address: data.address,
    property_size: data.propertySize,
    service: Array.isArray(data.services) ? data.services.join(', ') : data.services,
    message: data.additionalInfo || 'No additional info provided',
    urgency: data.urgency || 'flexible',
    submission_date: new Date().toLocaleDateString(),
    submission_time: new Date().toLocaleTimeString(),
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw - email failure shouldn't fail the quote submission
  }
}

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
      // Also accept the quoteService format
      service,
      location,
      contactMethod,
      preferredDate,
      message,
    } = body;

    // Support both formats (quote page and quoteService)
    const finalServices = services || (service ? [service] : []);
    const finalAddress = address || location || '';
    const finalAdditionalInfo = additionalInfo || message || '';
    const finalPropertySize = propertySize || 'Not specified';

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    // Try to save to database (optional - don't fail if DB unavailable)
    let quoteId = null;
    try {
      const quote = await prisma.quote.create({
        data: {
          name,
          email,
          phone,
          address: finalAddress,
          propertySize: finalPropertySize,
          services: Array.isArray(finalServices) ? finalServices : [finalServices],
          additionalInfo: finalAdditionalInfo || null,
          urgency: urgency || 'flexible',
          status: 'pending',
        },
      });
      quoteId = quote.id;
    } catch (dbError) {
      console.warn('Database save failed, continuing with email:', dbError);
    }

    // Send email notification (server-side EmailJS)
    await sendEmailNotification({
      name,
      email,
      phone,
      address: finalAddress,
      propertySize: finalPropertySize,
      services: Array.isArray(finalServices) ? finalServices : [finalServices],
      additionalInfo: finalAdditionalInfo,
      urgency,
    });

    return NextResponse.json({
      success: true,
      quoteId,
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
