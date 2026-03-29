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
        fetch('/api/crm?type=quotes'),
        fetch('/api/crm?type=contacts'),
      ]);
      // Fallback: if CRM API doesn't exist yet, use empty arrays
      const quotes = quotesRes.ok ? await quotesRes.json() : [];
      const contacts = contactsRes.ok ? await contactsRes.json() : [];
      setData({ quotes: Array.isArray(quotes) ? quotes : [], contacts: Array.isArray(contacts) ? contacts : [] });
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
        {activeTab === 'pipeline' && <PipelineView quotes={data?.quotes ?? []} stages={stages} />}
        {activeTab === 'contacts' && <ContactsView contacts={data?.contacts ?? []} quotes={data?.quotes ?? []} />}
        {activeTab === 'invoices' && <InvoicesView quotes={data?.quotes ?? []} />}
        {activeTab === 'automations' && <AutomationsView />}
        {activeTab === 'activity' && <ActivityView quotes={data?.quotes ?? []} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline View — Kanban board
// ---------------------------------------------------------------------------

function PipelineView({ quotes, stages }: { quotes: Quote[]; stages: typeof workspaceContext.crmConfig.pipelineStages }) {
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

  return (
    <div className="flex gap-3 p-4 overflow-x-auto h-full">
      {stages.map((stage) => {
        const stageQuotes = stageMap.get(stage.id) ?? [];
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

            {/* Column body */}
            <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-muted/30 p-2">
              {stageQuotes.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground/50">
                  No leads
                </div>
              )}
              {stageQuotes.map((quote) => (
                <Card key={quote.id} className="cursor-pointer hover:shadow-md transition-shadow">
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

function InvoicesView({ quotes }: { quotes: Quote[] }) {
  const quotedOrWon = quotes.filter(q => q.status === 'quoted' || q.status === 'won' || q.status === 'invoiced' || q.status === 'paid');

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
                  <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Send Invoice
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

function AutomationsView() {
  const { crmConfig } = workspaceContext;

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Automations</h2>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Auto Follow-Up Rules</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(crmConfig.autoFollowUpDays).map(([priority, days]) => (
                <div key={priority} className="flex items-center justify-between text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    priority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    priority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {priority}
                  </span>
                  <span className="text-muted-foreground">Follow up within {days} day{days > 1 ? 's' : ''}</span>
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
