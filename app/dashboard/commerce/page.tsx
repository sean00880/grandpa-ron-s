'use client';

import { useState } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';

const COMMERCE_TABS = [
  { id: 'revenue', label: 'Revenue', color: '#22c55e' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'payouts', label: 'Payouts' },
  { id: 'promos', label: 'Promos' },
];

export default function CommercePage() {
  const [activeTab, setActiveTab] = useSurfaceTab('revenue', ['revenue', 'invoices', 'subscriptions', 'payouts', 'promos'] as const);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader title="COMMERCE" titleColor="#22c55e" tabs={COMMERCE_TABS} activeTab={activeTab} onTabChange={setActiveTab as (tabId: string) => void} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'revenue' && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">$0</div><div className="text-xs text-muted-foreground">MTD Revenue</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">$0</div><div className="text-xs text-muted-foreground">Outstanding</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">0</div><div className="text-xs text-muted-foreground">Paid Invoices</div></CardContent></Card>
          </div>
        )}
        {activeTab === 'invoices' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Invoices</h2>
            {[
              { id: 'INV-001', customer: 'Sarah Johnson', amount: 450, status: 'paid', date: '2026-03-28' },
              { id: 'INV-002', customer: 'Mike Roberts', amount: 1200, status: 'sent', date: '2026-03-27' },
              { id: 'INV-003', customer: 'Columbus Retail', amount: 3500, status: 'draft', date: '2026-03-29' },
            ].map(inv => (
              <Card key={inv.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{inv.id} — {inv.customer}</div>
                    <div className="text-xs text-muted-foreground">{inv.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${inv.amount.toLocaleString()}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${inv.status === 'paid' ? 'bg-green-500/15 text-green-500' : inv.status === 'sent' ? 'bg-blue-500/15 text-blue-500' : 'bg-muted text-muted-foreground'}`}>{inv.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            <h2 className="text-lg font-semibold">Active Promotions</h2>
            {[
              { name: 'Spring Early Bird', code: 'SPRING25', discount: '25% off', status: 'active', uses: 14 },
              { name: 'Referral Bonus', code: 'REFER50', discount: '$50 off', status: 'active', uses: 8 },
              { name: 'Bundle Deal', code: 'BUNDLE15', discount: '15% off 3+ services', status: 'active', uses: 3 },
            ].map(promo => (
              <Card key={promo.code}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{promo.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{promo.code} — {promo.discount}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">{promo.status}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{promo.uses} uses</div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
