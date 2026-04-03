'use client';

import { useState, useEffect } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, FileText, CreditCard, Tag, Percent } from 'lucide-react';

const COMMERCE_TABS = [
  { id: 'revenue', label: 'Revenue', color: '#22c55e' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'payouts', label: 'Payouts' },
  { id: 'promos', label: 'Promos' },
];

interface CommerceStats {
  mtdRevenue: number;
  outstanding: number;
  paidCount: number;
  invoices: Array<{
    id: string;
    customer: string;
    email: string;
    amount: number;
    status: string;
    date: string;
    services: string;
  }>;
}

export default function CommercePage() {
  const [activeTab, setActiveTab] = useSurfaceTab('revenue', ['revenue', 'invoices', 'subscriptions', 'payouts', 'promos'] as const);
  const [stats, setStats] = useState<CommerceStats | null>(null);
  const [promos, setPromos] = useState<Array<{ id: string; name: string; description: string; badge: string; code: string; expiresText: string }>>([]);

  useEffect(() => {
    fetch('/api/commerce/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(() => {});
    fetch('/api/promo/validate?location=columbus&customerType=new')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.promotions) setPromos(data.promotions); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="COMMERCE"
        titleColor="#22c55e"
        tabs={COMMERCE_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab as (tabId: string) => void}
        rightContent={
          stats ? (
            <span className="text-[10px] text-muted-foreground/50">
              {stats.invoices.length} transactions · {stats.paidCount} paid
            </span>
          ) : null
        }
      />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'revenue' && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">MTD Revenue</span>
                    <DollarSign size={14} className="text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">${(stats?.mtdRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
                  <div className="text-[10px] text-muted-foreground">from paid quotes this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Outstanding</span>
                    <FileText size={14} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold">${(stats?.outstanding ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
                  <div className="text-[10px] text-muted-foreground">invoiced + quoted awaiting payment</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Paid Invoices</span>
                    <CreditCard size={14} className="text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats?.paidCount ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">total completed payments</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by status breakdown */}
            {stats && stats.invoices.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
                  <div className="space-y-2">
                    {stats.invoices.slice(0, 8).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div>
                          <div className="text-sm font-medium">{inv.customer}</div>
                          <div className="text-[10px] text-muted-foreground">{inv.services.split(',').slice(0, 2).join(', ')}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">${inv.amount.toLocaleString()}</span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                            inv.status === 'paid' ? 'bg-green-500/15 text-green-500' :
                            inv.status === 'invoiced' ? 'bg-blue-500/15 text-blue-500' :
                            'bg-muted text-muted-foreground'
                          }`}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {stats && stats.invoices.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No revenue data yet. Quotes will appear here once created.
              </div>
            )}
            {!stats && (
              <div className="text-center py-12 text-sm text-muted-foreground">Loading commerce data...</div>
            )}
          </div>
        )}
        {activeTab === 'invoices' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Invoices</h2>
              <span className="text-[10px] text-muted-foreground">{stats?.invoices.length ?? 0} total</span>
            </div>
            {stats?.invoices.map(inv => (
              <Card key={inv.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{inv.customer}</div>
                    <div className="text-xs text-muted-foreground">
                      {inv.services.split(',').slice(0, 3).join(', ')} · {new Date(inv.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${inv.amount.toLocaleString()}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      inv.status === 'paid' ? 'bg-green-500/15 text-green-500' :
                      inv.status === 'invoiced' ? 'bg-blue-500/15 text-blue-500' :
                      'bg-muted text-muted-foreground'
                    }`}>{inv.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!stats || stats.invoices.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                {stats ? 'No invoices yet' : 'Loading...'}
              </div>
            )}
          </div>
        )}
        {activeTab === 'subscriptions' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Subscription Plans</h2>
            {[
              { name: 'Weekly Mowing', price: 45, customers: 12, cycle: 'weekly' },
              { name: 'Monthly Maintenance', price: 150, customers: 8, cycle: 'monthly' },
              { name: 'Year-Round Service', price: 200, customers: 3, cycle: 'monthly' },
            ].map(sub => (
              <Card key={sub.name}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{sub.name}</div>
                    <div className="text-xs text-muted-foreground">{sub.customers} active customers</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${sub.price}/{sub.cycle === 'weekly' ? 'wk' : 'mo'}</div>
                    <div className="text-[10px] text-muted-foreground">${(sub.price * sub.customers).toLocaleString()}/mo MRR</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'promos' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Promotions</h2>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Tag size={10} /> from promotionEngineService
              </span>
            </div>
            {promos.length > 0 ? promos.map(promo => (
              <Card key={promo.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                    <Percent size={16} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{promo.name}</div>
                    <div className="text-xs text-muted-foreground">{promo.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{promo.code}</span>
                      <span className="text-[10px] text-green-500 font-medium">{promo.badge}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">active</span>
                    {promo.expiresText && <div className="text-[10px] text-muted-foreground mt-0.5">{promo.expiresText}</div>}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 text-sm text-muted-foreground">
                {promos.length === 0 ? 'Loading promotions...' : 'No active promotions'}
              </div>
            )}
          </div>
        )}
        {activeTab === 'payouts' && (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            Payouts — connect Stripe to view payout history
          </div>
        )}
      </div>
    </div>
  );
}
