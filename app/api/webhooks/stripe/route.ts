/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe — Handle Stripe webhook events
 */

import { NextRequest } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { db } from '@/lib/orcbase';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object;
        const quoteId = invoice.metadata?.quote_id;
        if (quoteId) {
          await db.quotes.update({ id: quoteId }, { status: 'paid' });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const quoteId = invoice.metadata?.quote_id;
        if (quoteId) {
          await db.quotes.update({ id: quoteId }, { status: 'payment_failed' });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        console.log('[Stripe] Payment succeeded:', event.data.object.id);
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
