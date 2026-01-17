/**
 * Server-side EmailJS API Route
 * Uses private key for secure email sending (bypasses domain whitelist issues)
 */

import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

// Initialize EmailJS with both public and private keys
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;

export async function POST(request: NextRequest) {
  try {
    // Validate environment configuration
    if (!publicKey || !privateKey || !serviceId || !templateId) {
      console.error('EmailJS configuration missing:', {
        hasPublicKey: !!publicKey,
        hasPrivateKey: !!privateKey,
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
      });
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      phone,
      service,
      propertySize,
      location,
      address,
      contactMethod,
      preferredDate,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    // Prepare template parameters
    const templateParams = {
      to_name: "Grandpa Ron's Team",
      from_name: name,
      from_email: email,
      phone: phone,
      service: service || '',
      property_size: propertySize || '',
      location: location || '',
      address: address || '',
      contact_method: contactMethod || '',
      preferred_date: preferredDate || '',
      message: message || '',
      submission_date: new Date().toLocaleDateString(),
      submission_time: new Date().toLocaleTimeString(),
    };

    // Send email using server-side SDK with private key
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    console.log('EmailJS response:', response.status, response.text);

    return NextResponse.json({
      success: true,
      message: 'Quote request sent successfully',
    });
  } catch (error) {
    console.error('EmailJS send error:', error);

    // Return more specific error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to send quote request', details: errorMessage },
      { status: 500 }
    );
  }
}
