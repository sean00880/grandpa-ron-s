'use client';

/**
 * CRM — Pipeline management, contacts, invoicing, automations.
 *
 * Supersedes HubSpot/Monday.com for field service businesses:
 * - Kanban pipeline with drag-ready stages
 * - Lead scoring (already exists via leadScoringService)
 * - Auto follow-ups by priority
 * - Quote-to-invoice via Stripe
 * - Activity timeline per contact
 * - Industry-specific custom fields
 *
 * Data: Orcbase → Dbity Row Engine (quotes, contacts)
 * Config: workspaceContext.crmConfig (pipeline stages, follow-up rules)
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurfaceHeader, useSurfaceTab, type SurfaceTab } from '@growsz/arcorc-layout';
import { workspaceContext } from '@/data/workspaceContext';
import type { Quote } from '@/lib/orcbase';

const CRM_TABS: SurfaceTab[] = [
  { id: 'pipeline', label: 'Pipeline', color: '#8b5cf6' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'automations', label: 'Automations' },
  { id: 'activity', label: 'Activity' },
];

interface CRMData {
  quotes: Quote[];
  contacts: Array<{ id: string; name: string; email: string; subject?: string; message: string; status: string; createdAt: string }>;
}

export default function CRMPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('pipeline', ['pipeline', 'contacts', 'invoices', 'automations', 'activity'] as const);
  const [data, setData] = useState<CRMData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [quotesRes, contactsRes] = await Promise.all([
        fetch('/api/crm?view=quotes'),
        fetch('/api/crm?view=contacts'),
      ]);
      const quotesJson = quotesRes.ok ? await quotesRes.json() : [];
      const contactsJson = contactsRes.ok ? await contactsRes.json() : { contacts: [] };
      setData({
        quotes: Array.isArray(quotesJson) ? quotesJson : [],
        contacts: Array.isArray(contactsJson) ? contactsJson : (contactsJson.contacts ?? []),
      });
    } catch {
      setData({ quotes: [], contacts: [] });
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { crmConfig } = workspaceContext;
  const stages = crmConfig.pipelineStages;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="CRM"
        titleColor="#8b5cf6"
        tabs={CRM_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab as (tabId: string) => void}
        rightContent={
          <span className="text-[10px] text-muted-foreground/50">
            {data?.quotes.length ?? 0} leads · {stages.length} stages
          </span>
        }
      />

      <div className="flex-1 overflow-hidden">
        {activeTab === 'pipeline' && <PipelineView quotes={data?.quotes ?? []} stages={stages} onRefresh={fetchData} />}
        {activeTab === 'contacts' && <ContactsView contacts={data?.contacts ?? []} quotes={data?.quotes ?? []} />}
        {activeTab === 'invoices' && <InvoicesView quotes={data?.quotes ?? []} onRefresh={fetchData} />}
        {activeTab === 'automations' && <AutomationsView quotes={data?.quotes ?? []} />}
        {activeTab === 'activity' && <ActivityView quotes={data?.quotes ?? []} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline View — Kanban board
// ---------------------------------------------------------------------------

function PipelineView({ quotes, stages, onRefresh }: { quotes: Quote[]; stages: typeof workspaceContext.crmConfig.pipelineStages; onRefresh: () => void }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Map quotes to pipeline stages
  const stageMap = new Map<string, Quote[]>();
  for (const stage of stages) {
    stageMap.set(stage.id, []);
  }
  for (const quote of quotes) {
    const stageId = quote.status ?? 'new';
    const mapped = stageMap.get(stageId) ?? stageMap.get('new')!;
    mapped.push(quote);
  }

  const handleDragStart = (e: React.DragEvent, quoteId: string) => {
    e.dataTransfer.setData('text/plain', quoteId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(quoteId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(stageId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDropTarget(null);
    setDraggingId(null);
    const quoteId = e.dataTransfer.getData('text/plain');
    if (!quoteId) return;

    const quote = quotes.find(q => q.id === quoteId);
    if (!quote || quote.status === newStatus) return;

    try {
      await fetch(`/api/quote/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update quote status:', err);
    }
  };

  return (
    <div className="flex gap-3 p-4 overflow-x-auto h-full">
      {stages.map((stage) => {
        const stageQuotes = stageMap.get(stage.id) ?? [];
        const isDropping = dropTarget === stage.id;
        return (
          <div key={stage.id} className="flex flex-col min-w-[260px] max-w-[300px]">
            {/* Column header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-xs font-semibold">{stage.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground rounded-full bg-muted px-2 py-0.5">
                {stageQuotes.length}
              </span>
            </div>

            {/* Column body — drop zone */}
            <div
              className={`flex-1 space-y-2 overflow-y-auto rounded-lg p-2 transition-colors ${
                isDropping ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/30'
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {stageQuotes.length === 0 && (
                <div className={`text-center py-8 text-xs ${isDropping ? 'text-primary/70' : 'text-muted-foreground/50'}`}>
                  {isDropping ? 'Drop here' : 'No leads'}
                </div>
              )}
              {stageQuotes.map((quote) => (
                <Card
                  key={quote.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, quote.id)}
                  onDragEnd={() => { setDraggingId(null); setDropTarget(null); }}
                  className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                    draggingId === quote.id ? 'opacity-40 scale-95' : ''
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{quote.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{quote.email}</div>
                      </div>
                      {quote.leadPriority && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          quote.leadPriority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          quote.leadPriority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {quote.leadPriority}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {quote.services?.split(',').slice(0, 2).join(', ')}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {quote.estimatedValue && (
                        <span className="text-xs font-medium">${quote.estimatedValue.toFixed(0)}</span>
                      )}
                      {quote.leadScore !== null && quote.leadScore !== undefined && (
                        <span className="text-[10px] text-muted-foreground">Score: {quote.leadScore}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contacts View — Unified contact list
// ---------------------------------------------------------------------------

function ContactsView({ contacts, quotes }: { contacts: CRMData['contacts']; quotes: Quote[] }) {
  // Merge unique contacts from quotes + contact form submissions
  const contactMap = new Map<string, { name: string; email: string; phone?: string; source: string; lastActivity: string; totalValue: number }>();

  for (const q of quotes) {
    const existing = contactMap.get(q.email);
    contactMap.set(q.email, {
      name: q.name,
      email: q.email,
      phone: q.phone,
      source: existing ? 'multiple' : 'quote',
      lastActivity: q.createdAt?.toISOString?.() ?? new Date().toISOString(),
      totalValue: (existing?.totalValue ?? 0) + (q.estimatedValue ?? 0),
    });
  }

  for (const c of contacts) {
    if (!contactMap.has(c.email)) {
      contactMap.set(c.email, {
        name: c.name,
        email: c.email,
        source: 'contact_form',
        lastActivity: c.createdAt,
        totalValue: 0,
      });
    }
  }

  const allContacts = Array.from(contactMap.values());

  return (
    <div className="p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Contacts</h2>
          <p className="text-xs text-muted-foreground">{allContacts.length} total contacts from quotes + submissions</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Source</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Value</th>
            </tr>
          </thead>
          <tbody>
            {allContacts.map((contact, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer">
                <td className="px-4 py-3 font-medium">{contact.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{contact.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{contact.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{contact.source}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {contact.totalValue > 0 ? `$${contact.totalValue.toFixed(0)}` : '—'}
                </td>
              </tr>
            ))}
            {allContacts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No contacts yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invoices View
// ---------------------------------------------------------------------------

function InvoicesView({ quotes, onRefresh }: { quotes: Quote[]; onRefresh: () => void }) {
  const [sendingId, setSendingId] = useState<string | null>(null);
  const quotedOrWon = quotes.filter(q => q.status === 'quoted' || q.status === 'won' || q.status === 'invoiced' || q.status === 'paid');

  const handleSendInvoice = async (quoteId: string) => {
    setSendingId(quoteId);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId }),
      });
      if (!res.ok) throw new Error('Invoice creation failed');
      onRefresh();
    } catch (err) {
      console.error('Failed to send invoice:', err);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Invoices</h2>
          <p className="text-xs text-muted-foreground">Quote-to-invoice via Stripe</p>
        </div>
      </div>

      <div className="space-y-3">
        {quotedOrWon.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.services?.split(',').slice(0, 3).join(', ')}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{q.estimatedValue ? `$${q.estimatedValue.toFixed(0)}` : '—'}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  q.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  q.status === 'invoiced' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {q.status}
                </span>
                {q.status === 'quoted' && (
                  <button
                    onClick={() => handleSendInvoice(q.id)}
                    disabled={sendingId === q.id}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {sendingId === q.id ? 'Sending...' : 'Send Invoice'}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {quotedOrWon.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No invoiceable quotes yet</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Automations View
// ---------------------------------------------------------------------------

function AutomationsView({ quotes }: { quotes: Quote[] }) {
  const { crmConfig } = workspaceContext;

  // Compute overdue follow-ups from real quote data
  const now = new Date();
  const followUpStats = Object.entries(crmConfig.autoFollowUpDays).map(([priority, days]) => {
    const priorityQuotes = quotes.filter(q => q.leadPriority === priority && q.status === 'pending');
    const overdue = priorityQuotes.filter(q => {
      const created = new Date(q.createdAt?.toString() ?? 0);
      const dueDate = new Date(created.getTime() + (days as number) * 24 * 60 * 60 * 1000);
      return now > dueDate;
    });
    return { priority, days, total: priorityQuotes.length, overdue: overdue.length };
  });

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Automations</h2>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Auto Follow-Up Rules</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {followUpStats.map(({ priority, days, total, overdue }) => (
                <div key={priority} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      priority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      priority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {priority}
                    </span>
                    <span className="text-muted-foreground">within {days} day{days > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{total} pending</span>
                    {overdue > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 font-medium">{overdue} overdue</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Pipeline Stage Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {crmConfig.pipelineStages.filter(s => s.autoActions?.length).map((stage) => (
                <div key={stage.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span>{stage.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {stage.autoActions!.map((action) => (
                      <span key={action} className="rounded bg-muted px-2 py-0.5 text-[10px]">
                        {action.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Custom Fields</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {crmConfig.customFields.map((field) => (
                <div key={field.key} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{field.label}</span>
                  <span className="text-muted-foreground">{field.type}{field.options ? ` (${field.options.length} options)` : ''}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity View — Timeline
// ---------------------------------------------------------------------------

function ActivityView({ quotes }: { quotes: Quote[] }) {
  const activities = quotes
    .map(q => ({
      type: 'quote' as const,
      name: q.name,
      action: `submitted a quote request for ${q.services?.split(',')[0] ?? 'services'}`,
      timestamp: q.createdAt,
      value: q.estimatedValue,
      priority: q.leadPriority,
    }))
    .sort((a, b) => new Date(b.timestamp?.toString() ?? 0).getTime() - new Date(a.timestamp?.toString() ?? 0).getTime())
    .slice(0, 20);

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 border-l-2 border-muted pl-4 py-1">
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">{activity.name}</span>
                <span className="text-muted-foreground"> {activity.action}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {activity.timestamp ? new Date(activity.timestamp.toString()).toLocaleString() : '—'}
                {activity.value && ` · $${activity.value.toFixed(0)}`}
              </div>
            </div>
            {activity.priority && (
              <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                activity.priority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                activity.priority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-muted text-muted-foreground'
              }`}>
                {activity.priority}
              </span>
            )}
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No activity yet</div>
        )}
      </div>
    </div>
  );
}
