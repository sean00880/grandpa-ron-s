/**
 * Stripe Integration for Grandpa Ron's
 *
 * Handles invoicing, payment processing, and webhook events.
 * Connected to existing quote system for quote-to-invoice conversion.
 *
 * Section 21: Stripe-connected invoicing/payment flows.
 */

import Stripe from 'stripe';

// Server-side Stripe client
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key, { apiVersion: '2025-12-18.acacia' as Stripe.LatestApiVersion });
}

// ---------------------------------------------------------------------------
// Invoice Creation from Quote
// ---------------------------------------------------------------------------

export interface CreateInvoiceFromQuoteParams {
  quoteId: string;
  customerEmail: string;
  customerName: string;
  services: string[];
  estimatedValue: number;
  promoDiscount?: number;
  seasonalModifier?: number;
}

export async function createInvoiceFromQuote(
  params: CreateInvoiceFromQuoteParams,
): Promise<{ invoiceId: string; invoiceUrl: string; status: string }> {
  const stripe = getStripe();

  // Find or create Stripe customer
  const customers = await stripe.customers.list({ email: params.customerEmail, limit: 1 });
  let customer: Stripe.Customer;

  if (customers.data.length > 0) {
    customer = customers.data[0] as Stripe.Customer;
  } else {
    customer = await stripe.customers.create({
      email: params.customerEmail,
      name: params.customerName,
      metadata: { quote_id: params.quoteId, source: 'grandpa-ron-webdevos' },
    });
  }

  // Create invoice
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: 'send_invoice',
    days_until_due: 30,
    metadata: { quote_id: params.quoteId },
  });

  // Add line items for each service
  let totalAmount = params.estimatedValue;
  if (params.seasonalModifier) {
    totalAmount *= params.seasonalModifier;
  }
  if (params.promoDiscount) {
    totalAmount -= params.promoDiscount;
  }

  const perServiceAmount = Math.round((totalAmount / params.services.length) * 100); // cents

  for (const service of params.services) {
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: perServiceAmount,
      currency: 'usd',
      description: service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    });
  }

  // Finalize and send
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id);

  return {
    invoiceId: finalized.id,
    invoiceUrl: finalized.hosted_invoice_url ?? '',
    status: finalized.status ?? 'draft',
  };
}

// ---------------------------------------------------------------------------
// Payment Intent for direct payments
// ---------------------------------------------------------------------------

export async function createPaymentIntent(
  amount: number,
  customerEmail: string,
  metadata: Record<string, string>,
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripe = getStripe();

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: 'usd',
    receipt_email: customerEmail,
    metadata,
  });

  return {
    clientSecret: intent.client_secret ?? '',
    paymentIntentId: intent.id,
  };
}

// ---------------------------------------------------------------------------
// Webhook event handling
// ---------------------------------------------------------------------------

export type StripeWebhookEvent =
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'payment_intent.succeeded'
  | 'customer.created';

export async function constructWebhookEvent(
  body: string,
  signature: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
