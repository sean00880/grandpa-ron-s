/**
 * CRM Inbox Thread Detail — GET/POST/PATCH
 *
 * GET   /api/crm/inbox/[threadId]  — Thread + messages
 * POST  /api/crm/inbox/[threadId]  — Send reply
 * PATCH /api/crm/inbox/[threadId]  — Update (assign, archive, snooze)
 */

export const dynamic = 'force-dynamic';

import { inboxStore } from '@/lib/inbox-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;
    const thread = inboxStore.getThread(threadId);
    if (!thread) return Response.json({ error: 'Thread not found' }, { status: 404 });

    if (thread.status === 'unread') {
      inboxStore.updateThread(threadId, { status: 'read' });
    }

    const messages = inboxStore.getMessages(threadId);
    return Response.json({ thread: inboxStore.getThread(threadId), messages });
  } catch (error) {
    console.error('[CRM Inbox] GET thread error:', error);
    return Response.json({ error: 'Failed to get thread' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;
    const thread = inboxStore.getThread(threadId);
    if (!thread) return Response.json({ error: 'Thread not found' }, { status: 404 });

    const { body_text, from_name } = await request.json();
    if (!body_text) return Response.json({ error: 'body_text required' }, { status: 400 });

    const message = inboxStore.addMessage(threadId, {
      id: `msg-${crypto.randomUUID().slice(0, 8)}`,
      thread_id: threadId,
      from_address: 'info@grandparons.com',
      from_name: from_name ?? 'Grandpa Ron Team',
      to_addresses: thread.participants,
      subject: `Re: ${thread.subject}`,
      body_text,
      direction: 'outbound',
      sent_at: new Date().toISOString(),
    });

    inboxStore.updateThread(threadId, { status: 'replied' });
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error('[CRM Inbox] POST reply error:', error);
    return Response.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;
    const thread = inboxStore.getThread(threadId);
    if (!thread) return Response.json({ error: 'Thread not found' }, { status: 404 });

    const updates = await request.json();
    const allowed = ['status', 'assigned_to', 'priority', 'tags', 'linked_quote_id', 'linked_contact_id'];
    const filtered: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) filtered[key] = updates[key];
    }

    const updated = inboxStore.updateThread(threadId, filtered as any);
    return Response.json({ thread: updated });
  } catch (error) {
    console.error('[CRM Inbox] PATCH error:', error);
    return Response.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}
