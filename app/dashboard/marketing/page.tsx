'use client';

import { useState } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';

const MARKETING_TABS = [
  { id: 'campaigns', label: 'Campaigns', color: '#ec4899' },
  { id: 'seo', label: 'SEO' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'referrals', label: 'Referrals' },
  { id: 'social', label: 'Social' },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('campaigns', ['campaigns', 'seo', 'reviews', 'referrals', 'social'] as const);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader title="MARKETING" titleColor="#ec4899" tabs={MARKETING_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'campaigns' && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { title: 'Spring Lawn Prep', status: 'Active', color: '#22c55e' },
              { title: 'Mulching Season', status: 'Scheduled', color: '#f59e0b' },
              { title: 'Fall Cleanup', status: 'Draft', color: '#6b7280' },
              { title: 'Snow Early Bird', status: 'Draft', color: '#6b7280' },
            ].map(c => (
              <Card key={c.title}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="text-sm font-medium">{c.title}</div>
                  <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: c.color + '20', color: c.color }}>{c.status}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'seo' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">SEO Performance</h2>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: 'Organic Traffic', value: '2,847', change: '+12%' },
                { label: 'Keywords Ranked', value: '156', change: '+8' },
                { label: 'Avg Position', value: '14.2', change: '-2.1' },
                { label: 'Backlinks', value: '89', change: '+5' },
              ].map(m => (
                <Card key={m.label}>
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground">{m.label}</div>
                    <div className="text-[10px] text-green-500">{m.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Review Management</h2>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">4.8</div><div className="text-[10px] text-muted-foreground">Avg Rating</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">127</div><div className="text-[10px] text-muted-foreground">Total Reviews</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">94%</div><div className="text-[10px] text-muted-foreground">Response Rate</div></CardContent></Card>
            </div>
            <div className="text-xs text-muted-foreground">Auto-collection via WorkGun Review Collector integration active.</div>
          </div>
        )}
        {activeTab === 'referrals' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Referral Program</h2>
            {[
              { referrer: 'Mike Roberts', referred: 3, earned: 150 },
              { referrer: 'Sarah Johnson', referred: 2, earned: 100 },
              { referrer: 'Jim Patterson', referred: 1, earned: 50 },
            ].map(r => (
              <Card key={r.referrer}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r.referrer}</div>
                    <div className="text-xs text-muted-foreground">{r.referred} referrals</div>
                  </div>
                  <div className="font-semibold text-green-500">${r.earned} earned</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'social' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Social Media</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { platform: 'Google Business', followers: '2.1K', posts: 45 },
                { platform: 'Facebook', followers: '1.8K', posts: 32 },
                { platform: 'NextDoor', followers: '950', posts: 18 },
              ].map(s => (
                <Card key={s.platform}>
                  <CardContent className="p-4 text-center">
                    <div className="font-medium text-sm">{s.platform}</div>
                    <div className="text-lg font-bold mt-1">{s.followers}</div>
                    <div className="text-[10px] text-muted-foreground">{s.posts} posts</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
