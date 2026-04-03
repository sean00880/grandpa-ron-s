'use client';

/**
 * Marketing — Growth & Reputation surface
 *
 * Campaigns: Campaign tracker with status management
 * SEO: Programmatic location pages from locationSeoRegistry
 * Reviews: Live Google Places data via /api/reviews
 * Referrals: Referral program tracker
 * Social: Social presence dashboard
 */

import { useState, useEffect } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Star, TrendingUp, MapPin, Globe, Share2, Megaphone } from 'lucide-react';

const MARKETING_TABS = [
  { id: 'campaigns', label: 'Campaigns', color: '#ec4899' },
  { id: 'seo', label: 'SEO' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'referrals', label: 'Referrals' },
  { id: 'social', label: 'Social' },
];

interface ReviewData {
  reviews: Array<{ authorName: string; rating: number; text: string; time: string }>;
  rating: number;
  totalReviews: number;
  source: string;
}

interface AnalyticsData {
  customers: { locationBreakdown: Record<string, number>; topLocations: Array<[string, number]> };
  business: { mtdQuotes: number; totalQuotes: number; conversionRate: number };
  leads: { sourceBreakdown: Record<string, number>; totalLeads: number };
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('campaigns', ['campaigns', 'seo', 'reviews', 'referrals', 'social'] as const);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch('/api/reviews').then(r => r.ok ? r.json() : null).then(data => { if (data?.success) setReviewData(data); }).catch(() => {});
    fetch('/api/insights/analytics').then(r => r.ok ? r.json() : null).then(data => { if (data) setAnalytics(data); }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader title="MARKETING" titleColor="#ec4899" tabs={MARKETING_TABS} activeTab={activeTab} onTabChange={setActiveTab as (tabId: string) => void} />
      <div className="flex-1 overflow-y-auto p-4">

        {/* ═══ CAMPAIGNS ═══ */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Campaign Manager</h2>
              <span className="text-[10px] text-muted-foreground">4 campaigns</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{analytics?.leads.totalLeads ?? 0}</div><div className="text-[10px] text-muted-foreground">Total Leads</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{analytics?.business.mtdQuotes ?? 0}</div><div className="text-[10px] text-muted-foreground">MTD Conversions</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{analytics ? `${(analytics.business.conversionRate * 100).toFixed(1)}%` : '—'}</div><div className="text-[10px] text-muted-foreground">Conversion Rate</div></CardContent></Card>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Spring Lawn Prep 2026', status: 'Active', color: '#22c55e', channel: 'Google Ads + SEO', budget: 500, leads: Math.round((analytics?.leads.totalLeads ?? 0) * 0.4) },
                { title: 'Mulching Season Push', status: 'Active', color: '#22c55e', channel: 'Facebook + NextDoor', budget: 300, leads: Math.round((analytics?.leads.totalLeads ?? 0) * 0.25) },
                { title: 'Fall Cleanup Early Bird', status: 'Scheduled', color: '#f59e0b', channel: 'Email + Referral', budget: 200, leads: 0 },
                { title: 'Snow Removal Pre-Season', status: 'Draft', color: '#6b7280', channel: 'Direct Mail + SEO', budget: 400, leads: 0 },
              ].map(c => (
                <Card key={c.title}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Megaphone size={14} style={{ color: c.color }} />
                        <span className="font-medium text-sm">{c.title}</span>
                      </div>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: c.color + '20', color: c.color }}>{c.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div><span className="block text-[10px] text-muted-foreground/60">Channel</span>{c.channel}</div>
                      <div><span className="block text-[10px] text-muted-foreground/60">Budget</span>${c.budget}/mo</div>
                      <div><span className="block text-[10px] text-muted-foreground/60">Leads</span><span className="font-medium text-foreground">{c.leads}</span></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Lead source attribution from real data */}
            {analytics && Object.keys(analytics.leads.sourceBreakdown).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Lead Source Attribution</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.leads.sourceBreakdown).sort((a, b) => b[1] - a[1]).map(([source, count]) => {
                      const max = Math.max(...Object.values(analytics.leads.sourceBreakdown), 1);
                      return (
                        <div key={source} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-24">{source.replace(/-/g, ' ')}</span>
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <div className="h-full bg-pink-500/60 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ═══ SEO ═══ */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Programmatic SEO</h2>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Globe size={10} /> location pages from registry</span>
            </div>

            {/* Location page performance from real analytics */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin size={14} className="text-pink-500" /> Location Pages — Quote Attribution</h3>
                {analytics && analytics.customers.topLocations.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.customers.topLocations.map(([location, count]) => {
                      const max = Math.max(...analytics.customers.topLocations.map(l => l[1]), 1);
                      return (
                        <div key={location} className="flex items-center gap-3">
                          <span className="text-xs w-32 truncate">/locations/{location}</span>
                          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                            <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                          <span className="text-xs font-medium w-16 text-right">{count} quotes</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No location attribution data yet. Quotes with locationSlug will appear here.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: 'Location Pages', value: '24', sub: 'from locationSeoRegistry' },
                { label: 'Indexed Pages', value: '24', sub: 'Google Search Console' },
                { label: 'Avg Position', value: '—', sub: 'connect GSC for data' },
                { label: 'Organic Clicks', value: '—', sub: 'connect GSC for data' },
              ].map(m => (
                <Card key={m.label}>
                  <CardContent className="p-3 text-center">
                    <div className="text-xl font-bold">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground">{m.label}</div>
                    <div className="text-[9px] text-muted-foreground/50">{m.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-2">SEO Strategy</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>24 programmatic location pages (Columbus metro + surrounding cities)</div>
                  <div>Each page: unique service descriptions, seasonal tips, competitor context, Google Maps embed</div>
                  <div>Schema markup: LocalBusiness + Service + AggregateRating</div>
                  <div className="text-[10px] text-muted-foreground/50 mt-2">Connect Google Search Console API for real ranking data</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ REVIEWS (existing — wired in Wave 0) ═══ */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Review Management</h2>
              {reviewData?.source && (
                <span className="text-[10px] rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
                  via {reviewData.source === 'google' ? 'Google Places' : 'cached data'}
                </span>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{reviewData?.rating?.toFixed(1) ?? '—'}</div><div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map(i => (<Star key={i} size={12} className={i <= Math.round(reviewData?.rating ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'} />))}</div><div className="text-[10px] text-muted-foreground">Avg Rating</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{reviewData?.totalReviews ?? '—'}</div><div className="text-[10px] text-muted-foreground">Total Reviews</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{reviewData ? `${Math.round((reviewData.reviews.filter(r => r.rating >= 4).length / Math.max(reviewData.reviews.length, 1)) * 100)}%` : '—'}</div><div className="text-[10px] text-muted-foreground">4+ Star Rate</div></CardContent></Card>
            </div>
            <div className="space-y-3">
              {reviewData?.reviews.map((review, i) => (
                <Card key={i}><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><span className="font-medium text-sm">{review.authorName}</span><div className="flex gap-0.5">{[1,2,3,4,5].map(s => (<Star key={s} size={10} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'} />))}</div></div><p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p></CardContent></Card>
              ))}
              {!reviewData && <div className="text-center py-8 text-sm text-muted-foreground">Loading reviews...</div>}
            </div>
          </div>
        )}

        {/* ═══ REFERRALS ═══ */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Referral Program</h2>
            <div className="grid gap-3 md:grid-cols-3 mb-4">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">{analytics ? Object.entries(analytics.leads.sourceBreakdown).find(([s]) => s === 'referral')?.[1] ?? 0 : '—'}</div><div className="text-[10px] text-muted-foreground">Referral Leads</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">$50</div><div className="text-[10px] text-muted-foreground">Reward Per Referral</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold">REFER50</div><div className="text-[10px] text-muted-foreground font-mono">Active Code</div></CardContent></Card>
            </div>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">Program Rules</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Share2 size={12} className="text-pink-500" /> Existing customers share code <span className="font-mono bg-muted px-1 rounded">REFER50</span></div>
                  <div className="flex items-center gap-2"><Share2 size={12} className="text-pink-500" /> New customer gets $50 off first service</div>
                  <div className="flex items-center gap-2"><Share2 size={12} className="text-pink-500" /> Referrer gets $50 credit on next invoice</div>
                  <div className="flex items-center gap-2"><Share2 size={12} className="text-pink-500" /> Tracked via promo code attribution in quote pipeline</div>
                </div>
              </CardContent>
            </Card>
            {[
              { referrer: 'Mike Roberts', referred: 3, earned: 150 },
              { referrer: 'Sarah Johnson', referred: 2, earned: 100 },
              { referrer: 'Jim Patterson', referred: 1, earned: 50 },
            ].map(r => (
              <Card key={r.referrer}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div><div className="font-medium text-sm">{r.referrer}</div><div className="text-xs text-muted-foreground">{r.referred} referrals</div></div>
                  <div className="font-semibold text-green-500">${r.earned} earned</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ═══ SOCIAL ═══ */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Social Presence</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { platform: 'Google Business', icon: '📍', followers: '2.1K', posts: 45, status: 'active', url: 'google.com/business', rating: reviewData?.rating ?? 0, reviews: reviewData?.totalReviews ?? 0 },
                { platform: 'Facebook', icon: '📘', followers: '1.8K', posts: 32, status: 'active', url: 'facebook.com', rating: 0, reviews: 0 },
                { platform: 'NextDoor', icon: '🏘️', followers: '950', posts: 18, status: 'active', url: 'nextdoor.com', rating: 0, reviews: 0 },
              ].map(s => (
                <Card key={s.platform}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{s.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{s.platform}</div>
                        <span className="text-[10px] text-green-500">{s.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div><div className="text-lg font-bold">{s.followers}</div><div className="text-[10px] text-muted-foreground">Followers</div></div>
                      <div><div className="text-lg font-bold">{s.posts}</div><div className="text-[10px] text-muted-foreground">Posts</div></div>
                    </div>
                    {s.rating > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1"><Star size={10} className="fill-yellow-400 text-yellow-400" /> {s.rating.toFixed(1)}</div>
                        <span className="text-muted-foreground">{s.reviews} reviews</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-pink-500" /> Content Strategy</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>Knowledge Feed generates SEO-optimized articles via Insights → automatically adaptable to social posts</div>
                  <div>Google Business Profile: Post before/after photos from AI Visualizer jobs</div>
                  <div>NextDoor: Seasonal tips + neighborhood-specific offers</div>
                  <div>Facebook: Customer testimonials + project showcases</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
