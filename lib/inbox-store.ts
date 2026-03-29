/**
 * In-Memory CRM Inbox Store
 *
 * Temporary storage until Dbity email_threads/email_messages tables deploy.
 * Same singleton pattern as insightsDb in lib/orcbase.ts.
 */

export interface InboxThread {
  id: string;
  workspace_id: string;
  channel_id: string;
  subject: string;
  participants: string[];
  snippet: string;
  linked_quote_id?: string;
  linked_contact_id?: string;
  assigned_to?: string;
  status: 'unread' | 'read' | 'replied' | 'snoozed' | 'archived';
  priority: 'urgent' | 'normal' | 'low';
  tags: string[];
  last_message_at: string;
  message_count: number;
  created_at: string;
}

export interface InboxMessage {
  id: string;
  thread_id: string;
  from_address: string;
  from_name: string;
  to_addresses: string[];
  subject: string;
  body_text: string;
  direction: 'inbound' | 'outbound';
  sent_at: string;
}

export interface EmailChannel {
  id: string;
  workspace_id: string;
  type: 'gmail_sync' | 'domain_email' | 'shared_inbox' | 'automated';
  display_name: string;
  email_address: string;
  is_default: boolean;
  sync_status: 'pending' | 'active' | 'error' | 'paused';
  provider_config: Record<string, unknown>;
  last_sync_at?: string;
  created_at: string;
}

class InboxStore {
  private threads = new Map<string, InboxThread>();
  private messages = new Map<string, InboxMessage[]>();
  private channels = new Map<string, EmailChannel>();

  createThread(thread: InboxThread): InboxThread {
    this.threads.set(thread.id, thread);
    this.messages.set(thread.id, []);
    return thread;
  }

  getThread(id: string): InboxThread | undefined {
    return this.threads.get(id);
  }

  listThreads(params?: {
    status?: string;
    assigned_to?: string;
    limit?: number;
  }): InboxThread[] {
    let results = Array.from(this.threads.values());
    if (params?.status) results = results.filter(t => t.status === params.status);
    if (params?.assigned_to) results = results.filter(t => t.assigned_to === params.assigned_to);
    results.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
    if (params?.limit) results = results.slice(0, params.limit);
    return results;
  }

  updateThread(id: string, updates: Partial<InboxThread>): InboxThread | null {
    const existing = this.threads.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.threads.set(id, updated);
    return updated;
  }

  addMessage(threadId: string, message: InboxMessage): InboxMessage {
    const msgs = this.messages.get(threadId) ?? [];
    msgs.push(message);
    this.messages.set(threadId, msgs);
    const thread = this.threads.get(threadId);
    if (thread) {
      thread.message_count = msgs.length;
      thread.last_message_at = message.sent_at;
      thread.snippet = message.body_text.slice(0, 120);
    }
    return message;
  }

  getMessages(threadId: string): InboxMessage[] {
    return this.messages.get(threadId) ?? [];
  }

  getUnreadCount(): number {
    return Array.from(this.threads.values()).filter(t => t.status === 'unread').length;
  }

  // --- Email Channel Management ---

  addChannel(channel: EmailChannel): EmailChannel {
    this.channels.set(channel.id, channel);
    return channel;
  }

  getChannel(id: string): EmailChannel | undefined {
    return this.channels.get(id);
  }

  listChannels(): EmailChannel[] {
    return Array.from(this.channels.values());
  }

  updateChannel(id: string, updates: Partial<EmailChannel>): EmailChannel | null {
    const existing = this.channels.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.channels.set(id, updated);
    return updated;
  }
}

export const inboxStore = new InboxStore();

// Seed default email channel
inboxStore.addChannel({
  id: 'ch-default',
  workspace_id: 'grandpa-ron',
  type: 'automated',
  display_name: 'System Email',
  email_address: 'info@grandparons.com',
  is_default: true,
  sync_status: 'active',
  provider_config: { provider: 'emailjs' },
  created_at: new Date().toISOString(),
});

// Seed demo data
const now = new Date();
const day = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

inboxStore.createThread({
  id: 'thread-001', workspace_id: 'grandpa-ron', channel_id: 'ch-default',
  subject: 'Quote request - spring cleanup', participants: ['sarah.j@email.com'],
  snippet: 'Hi, I need a quote for spring cleanup of my yard...', status: 'unread',
  priority: 'urgent', tags: ['new-lead'], last_message_at: day(0), message_count: 1, created_at: day(0),
});
inboxStore.addMessage('thread-001', {
  id: 'msg-001', thread_id: 'thread-001', from_address: 'sarah.j@email.com',
  from_name: 'Sarah Johnson', to_addresses: ['info@grandparons.com'],
  subject: 'Quote request - spring cleanup',
  body_text: 'Hi, I need a quote for spring cleanup of my yard in Upper Arlington. About 0.5 acres with some overgrown beds. Can you come out this week?',
  direction: 'inbound', sent_at: day(0),
});

inboxStore.createThread({
  id: 'thread-002', workspace_id: 'grandpa-ron', channel_id: 'ch-default',
  subject: 'Re: Mulching estimate #Q-2847', participants: ['mike.r@gmail.com'],
  snippet: 'Thanks for the estimate! When can you start?', linked_quote_id: 'Q-2847',
  status: 'read', priority: 'normal', tags: ['follow-up'], last_message_at: day(1), message_count: 3, created_at: day(3),
});

inboxStore.createThread({
  id: 'thread-003', workspace_id: 'grandpa-ron', channel_id: 'ch-default',
  subject: 'Commercial property inquiry', participants: ['ops@columbusretail.com'],
  snippet: 'We manage 4 retail locations and need year-round service...', status: 'unread',
  priority: 'urgent', tags: ['commercial', 'high-value'], last_message_at: day(0), message_count: 1, created_at: day(0),
});
inboxStore.addMessage('thread-003', {
  id: 'msg-003', thread_id: 'thread-003', from_address: 'ops@columbusretail.com',
  from_name: 'Columbus Retail Management', to_addresses: ['info@grandparons.com'],
  subject: 'Commercial property inquiry',
  body_text: 'We manage 4 retail locations in the greater Columbus area and need year-round landscaping. Looking for a single provider for mowing, snow removal, and seasonal plantings. Can we schedule a walkthrough?',
  direction: 'inbound', sent_at: day(0),
});

inboxStore.createThread({
  id: 'thread-004', workspace_id: 'grandpa-ron', channel_id: 'ch-default',
  subject: 'Great job on the landscaping!', participants: ['happy.customer@yahoo.com'],
  snippet: 'Just wanted to say your team did an amazing job...', status: 'replied',
  priority: 'low', tags: ['positive-feedback'], last_message_at: day(2), message_count: 2, created_at: day(4),
});
