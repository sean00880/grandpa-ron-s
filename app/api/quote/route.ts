
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import emailjs from '@emailjs/nodejs';

// EmailJS Configuration
const getEmailJSConfig = () => {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const businessEmail = process.env.BUSINESS_EMAIL || 'fgreatful@gmail.com';

  return { serviceId, templateId, publicKey, privateKey, businessEmail };
};

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
  contactMethod?: string;
  preferredDate?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { serviceId, templateId, publicKey, privateKey, businessEmail } = getEmailJSConfig();

  // Validate configuration
  if (!serviceId || !templateId || !publicKey) {
    const missing = [];
    if (!serviceId) missing.push('EMAILJS_SERVICE_ID');
    if (!templateId) missing.push('EMAILJS_TEMPLATE_ID');
    if (!publicKey) missing.push('EMAILJS_PUBLIC_KEY');
    console.error(`EmailJS missing configuration: ${missing.join(', ')}`);
    return { success: false, error: `Missing EmailJS config: ${missing.join(', ')}` };
  }

  if (!privateKey) {
    console.error('EmailJS PRIVATE_KEY is missing - required for server-side sending');
    return { success: false, error: 'Missing EMAILJS_PRIVATE_KEY' };
  }

  // Build template parameters - these must match your EmailJS template variables
  const templateParams = {
    // Recipient (business owner)
    to_email: businessEmail,
    to_name: "Grandpa Ron's Team",

    // Sender/Customer info
    from_name: data.name,
    from_email: data.email,
    reply_to: data.email, // Allows replying directly to customer

    // Contact details
    phone: data.phone,
    contact_method: data.contactMethod || 'Not specified',

    // Service details
    service: Array.isArray(data.services) ? data.services.join(', ') : data.services,
    property_size: data.propertySize || 'Not specified',
    address: data.address || 'Not provided',
    preferred_date: data.preferredDate || 'Flexible',
    urgency: data.urgency || 'flexible',

    // Message
    message: data.additionalInfo || 'No additional details provided',

    // Metadata
    submission_date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    submission_time: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
  };

  console.log('Sending email with params:', {
    serviceId,
    templateId,
    to_email: templateParams.to_email,
    from_name: templateParams.from_name,
    from_email: templateParams.from_email,
  });

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });
    console.log('EmailJS Response:', response.status, response.text);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('EmailJS Error:', error);
    return { success: false, error: errorMessage };
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
    const emailResult = await sendEmailNotification({
      name,
      email,
      phone,
      address: finalAddress,
      propertySize: finalPropertySize,
      services: Array.isArray(finalServices) ? finalServices : [finalServices],
      additionalInfo: finalAdditionalInfo,
      urgency,
      contactMethod,
      preferredDate,
    });

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      // Don't fail the request - we still saved to DB if available
    }

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
