/**
 * CRM Dashboard API — Unified pipeline/contacts/inbox/activity view
 *
 * GET /api/crm?view=pipeline|contacts|inbox|activity
 */

export const dynamic = 'force-dynamic';

import { db } from '@/lib/orcbase';
import { inboxStore } from '@/lib/inbox-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') ?? searchParams.get('type') ?? 'pipeline';

    switch (view) {
      case 'pipeline': {
        const quotes = await db.quotes.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
        const stages = ['pending', 'contacted', 'quoted', 'negotiating', 'invoiced', 'paid', 'lost'];
        const pipeline = stages.map(stage => ({
          stage,
          count: quotes.filter(q => q.status === stage).length,
          quotes: quotes.filter(q => q.status === stage).slice(0, 10),
        }));
        const totalValue = quotes.reduce((sum, q) => sum + (q.estimatedValue ?? 0), 0);
        return Response.json({ pipeline, meta: { total_quotes: quotes.length, total_value: totalValue } });
      }

      case 'contacts': {
        const contacts = await db.contacts.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
        return Response.json({ contacts, meta: { total: contacts.length } });
      }

      case 'inbox': {
        const threads = inboxStore.listThreads({ limit: 10 });
        const unread = inboxStore.getUnreadCount();
        return Response.json({ threads, meta: { unread_count: unread } });
      }

      case 'activity': {
        const quotes = await db.quotes.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
        const contacts = await db.contacts.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
        const threads = inboxStore.listThreads({ limit: 10 });

        const activity = [
          ...quotes.map(q => ({ type: 'quote', id: q.id, title: `Quote from ${q.name}`, at: q.createdAt })),
          ...contacts.map(c => ({ type: 'contact', id: c.id, title: `Contact from ${c.name}`, at: c.createdAt })),
          ...threads.map(t => ({ type: 'email', id: t.id, title: t.subject, at: t.last_message_at })),
        ].sort((a, b) => new Date(b.at as any).getTime() - new Date(a.at as any).getTime()).slice(0, 20);

        return Response.json({ activity, meta: { total: activity.length } });
      }

      default:
        return Response.json({ error: 'view must be pipeline, contacts, inbox, or activity' }, { status: 400 });
    }
  } catch (error) {
    console.error('[CRM] GET error:', error);
    return Response.json({ error: 'Failed to load CRM data' }, { status: 500 });
  }
}
