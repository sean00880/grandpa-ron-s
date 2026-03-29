/**
 * Invoices API — Create invoices from quotes
 * POST /api/invoices — Convert a quote to a Stripe invoice
 */

import { NextRequest } from 'next/server';
import { createInvoiceFromQuote } from '@/lib/stripe';
import { db } from '@/lib/orcbase';
import { z } from 'zod';

const InvoiceSchema = z.object({
  quoteId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid invoice data', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const quote = await db.quotes.findUnique({
      id: parsed.data.quoteId,
    });

    if (!quote) {
      return Response.json({ error: 'Quote not found' }, { status: 404 });
    }

    const services = quote.services.split(',').map((s: string) => s.trim());

    const result = await createInvoiceFromQuote({
      quoteId: quote.id,
      customerEmail: quote.email,
      customerName: quote.name,
      services,
      estimatedValue: quote.estimatedValue ?? 0,
      promoDiscount: quote.promoDiscount ?? undefined,
      seasonalModifier: quote.seasonalModifier ?? undefined,
    });

    // Update quote status
    await db.quotes.update({ id: quote.id }, { status: 'invoiced' });

    return Response.json(result);
  } catch (error) {
    console.error('Invoice API error:', error);
    return Response.json({ error: 'Invoice creation failed' }, { status: 500 });
  }
}
