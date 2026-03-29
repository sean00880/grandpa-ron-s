/**
 * CRM Inbox API — Thread listing + creation
 *
 * GET  /api/crm/inbox?status=unread&limit=20  — List email threads
 * POST /api/crm/inbox                          — Create new thread
 */

export const dynamic = 'force-dynamic';

import { inboxStore } from '@/lib/inbox-store';
import { db } from '@/lib/orcbase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? undefined;
    const assigned_to = searchParams.get('assigned_to') ?? undefined;
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    const threads = inboxStore.listThreads({ status, assigned_to, limit });
    const unread_count = inboxStore.getUnreadCount();

    return Response.json({ threads, meta: { unread_count, total: threads.length } });
  } catch (error) {
    console.error('[CRM Inbox] GET error:', error);
    return Response.json({ error: 'Failed to list threads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from_email, from_name, subject, body_text } = body;

    if (!from_email || !subject) {
      return Response.json({ error: 'from_email and subject required' }, { status: 400 });
    }

    // Auto-link: check if email matches existing quote or contact
    let linked_quote_id: string | undefined;
    let linked_contact_id: string | undefined;
    try {
      const quotes = await db.quotes.findMany({ where: { email: from_email }, take: 1 });
      if (quotes.length > 0) linked_quote_id = quotes[0].id;
      const contacts = await db.contacts.findMany({ take: 100 });
      const match = contacts.find(c => c.email === from_email);
      if (match) linked_contact_id = match.id;
    } catch { /* fallback: no auto-link */ }

    const threadId = `thread-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const thread = inboxStore.createThread({
      id: threadId,
      workspace_id: 'grandpa-ron',
      channel_id: 'ch-default',
      subject,
      participants: [from_email],
      snippet: (body_text ?? '').slice(0, 120),
      linked_quote_id,
      linked_contact_id,
      status: 'unread',
      priority: 'normal',
      tags: linked_quote_id ? ['quote-linked'] : [],
      last_message_at: now,
      message_count: 1,
      created_at: now,
    });

    if (body_text) {
      inboxStore.addMessage(threadId, {
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        thread_id: threadId,
        from_address: from_email,
        from_name: from_name ?? from_email.split('@')[0],
        to_addresses: ['info@grandparons.com'],
        subject,
        body_text,
        direction: 'inbound',
        sent_at: now,
      });
    }

    return Response.json({ thread, auto_linked: { quote: linked_quote_id, contact: linked_contact_id } }, { status: 201 });
  } catch (error) {
    console.error('[CRM Inbox] POST error:', error);
    return Response.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
