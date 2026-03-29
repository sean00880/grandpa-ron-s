/**
 * Payments API — Create payment intents for direct payments
 * POST /api/payments — Create a payment intent
 */

import { NextRequest } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { z } from 'zod';

const PaymentSchema = z.object({
  amount: z.number().min(1).max(100000),
  email: z.string().email(),
  quoteId: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PaymentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid payment data', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { amount, email, quoteId, description } = parsed.data;

    const result = await createPaymentIntent(amount, email, {
      quote_id: quoteId ?? '',
      description: description ?? 'Grandpa Ron\'s Lawncare Service',
      source: 'webdevos',
    });

    return Response.json(result);
  } catch (error) {
    console.error('Payment API error:', error);
    return Response.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
