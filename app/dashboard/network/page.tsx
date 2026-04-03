'use client';

import { useState, useEffect } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Wifi } from 'lucide-react';

const NETWORK_TABS = [
  { id: 'partners', label: 'Partners', color: '#06b6d4' },
  { id: 'listings', label: 'Listings' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'referrals', label: 'Referrals' },
];

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('partners', ['partners', 'listings', 'integrations', 'referrals'] as const);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    fetch('/api/integrations/status')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setIntegrations(data.integrations);
          setConnectedCount(data.connectedCount);
        }
      })
      .catch(() => {});
  }, []);

  const icons: Record<string, string> = {
    stripe: '💳', 'google-places': '📍', emailjs: '📧', gemini: '🤖',
    anthropic: '🧠', recaptcha: '🛡️', database: '🗄️', gmail: '📬',
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="NETWORK"
        titleColor="#06b6d4"
        tabs={NETWORK_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab as (tabId: string) => void}
        rightContent={
          integrations.length > 0 ? (
            <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
              <Wifi size={10} /> {connectedCount}/{integrations.length} connected
            </span>
          ) : null
        }
      />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'partners' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Partner Network</h2>
            {[
              { name: 'Ohio Tree Pros', type: 'Subcontractor', services: ['tree-trimming', 'hardscaping'], status: 'active' },
              { name: 'Columbus Irrigation', type: 'Referral Partner', services: ['irrigation', 'drainage'], status: 'active' },
              { name: 'BrightLawn Supply', type: 'Supplier', services: ['seed', 'fertilizer', 'mulch'], status: 'active' },
            ].map(p => (
              <Card key={p.name}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.type} — {p.services.join(', ')}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">{p.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Business Listings</h2>
            {[
              { platform: 'Google Business Profile', status: 'Claimed', rating: 4.8, reviews: 127 },
              { platform: 'Yelp', status: 'Claimed', rating: 4.5, reviews: 34 },
              { platform: 'HomeAdvisor', status: 'Not claimed', rating: 0, reviews: 0 },
              { platform: 'Angi', status: 'Pending', rating: 0, reviews: 0 },
            ].map(l => (
              <Card key={l.platform}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{l.platform}</div>
                    {l.rating > 0 && <div className="text-xs text-muted-foreground">{l.rating} stars — {l.reviews} reviews</div>}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${l.status === 'Claimed' ? 'bg-green-500/15 text-green-500' : l.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-500' : 'bg-muted text-muted-foreground'}`}>{l.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'integrations' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Connected Integrations</h2>
              <span className="text-xs text-muted-foreground">{connectedCount} of {integrations.length} active</span>
            </div>
            {integrations.length > 0 ? integrations.map(i => (
              <Card key={i.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-2xl">{icons[i.id] ?? '🔌'}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.description}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {i.connected ? (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-green-500/15 text-green-500">
                        <CheckCircle2 size={10} /> Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground">
                        <Circle size={10} /> Not configured
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading integration status...</div>
            )}
          </div>
        )}
        {activeTab === 'referrals' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Partner Referrals</h2>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">23</div><div className="text-[10px] text-muted-foreground">Referrals Sent</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">12</div><div className="text-[10px] text-muted-foreground">Referrals Received</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">$1,850</div><div className="text-[10px] text-muted-foreground">Referral Revenue</div></CardContent></Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
