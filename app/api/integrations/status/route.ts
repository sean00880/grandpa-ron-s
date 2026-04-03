/**
 * Integration Status API — Checks env var presence for each service
 * GET /api/integrations/status
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing + invoicing',
      connected: !!(process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    {
      id: 'google-places',
      name: 'Google Places',
      description: 'Review collection + business listing',
      connected: !!(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID),
    },
    {
      id: 'emailjs',
      name: 'EmailJS',
      description: 'Contact form delivery',
      connected: !!(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
    },
    {
      id: 'gemini',
      name: 'Gemini AI',
      description: 'Landscape visualization + content generation',
      connected: !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY),
    },
    {
      id: 'anthropic',
      name: 'Claude AI',
      description: 'Studio AI Core assistant',
      connected: !!process.env.ANTHROPIC_API_KEY,
    },
    {
      id: 'recaptcha',
      name: 'reCAPTCHA',
      description: 'Form spam protection',
      connected: !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY),
    },
    {
      id: 'database',
      name: 'Database',
      description: 'PostgreSQL via Prisma',
      connected: !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('file:')),
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'CRM inbox OAuth',
      connected: !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET),
    },
  ];

  const connectedCount = integrations.filter(i => i.connected).length;

  return Response.json({ integrations, connectedCount, total: integrations.length });
}
