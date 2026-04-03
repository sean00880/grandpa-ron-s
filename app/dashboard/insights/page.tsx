'use client';

/**
 * Insights — Knowledge Feed + Lead/Customer/Business Analytics
 *
 * Feed tab: Gemini-generated content (existing)
 * Lead/Customer/Business tabs: Real-time analytics from Quote data
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurfaceHeader, type SurfaceTab } from '@growsz/arcorc-layout';
import { TrendingUp, Users, BarChart3, Target, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { InsightsTopic, InsightsPost, InsightsRun } from '@/lib/orcbase';

const INSIGHTS_TABS: SurfaceTab[] = [
  { id: 'feed', label: 'Knowledge Feed', color: '#22c55e' },
  { id: 'leads', label: 'Lead Insights' },
  { id: 'customers', label: 'Customer Insights' },
  { id: 'business', label: 'Business Intel' },
  { id: 'industry', label: 'Industry Trends' },
];

interface InsightsData {
  topics: InsightsTopic[];
  posts: InsightsPost[];
  runs: InsightsRun[];
  stats: { totalTopics: number; totalPosts: number; enabledTopics: number };
}

interface AnalyticsData {
  leads: {
    scoreDistribution: Array<{ range: string; count: number }>;
    avgScore: number;
    priorityBreakdown: Record<string, number>;
    sourceBreakdown: Record<string, number>;
    topLeads: Array<{ name: string; email: string; score: number | null; priority: string | null; value: number | null }>;
    totalLeads: number;
    hotLeads: number;
  };
  customers: {
    totalUnique: number;
    repeatCustomers: number;
    repeatRate: number;
    avgClv1: number;
    avgClv3: number;
    sizeBreakdown: Record<string, number>;
    locationBreakdown: Record<string, number>;
    topLocations: Array<[string, number]>;
  };
  business: {
    mtdRevenue: number;
    lastMonthRevenue: number;
    quarterRevenue: number;
    avgQuoteValue: number;
    statusBreakdown: Record<string, number>;
    weeklyVelocity: Array<{ week: string; count: number; value: number }>;
    promoUsage: Record<string, number>;
    conversionRate: number;
    totalQuotes: number;
    mtdQuotes: number;
  };
}

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [data, setData] = useState<InsightsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/insights');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Failed to load insights');
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/insights/analytics');
      const json = await res.json();
      setAnalytics(json);
    } catch { /* graceful */ }
  }, []);

  useEffect(() => { fetchData(); fetchAnalytics(); }, [fetchData, fetchAnalytics]);

  const handleGenerate = async (topicId: string) => {
    setGenerating(topicId);
    setError(null);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }
      await fetchData();
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateAll = async () => {
    if (!data) return;
    for (const topic of data.topics.filter(t => t.enabled)) {
      await handleGenerate(topic.id);
    }
  };

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading Insights...</div>
      </div>
    );
  }

  const filteredPosts = selectedTopic
    ? data.posts.filter(p => p.topicId === selectedTopic)
    : data.posts;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="INSIGHTS"
        titleColor="#22c55e"
        tabs={INSIGHTS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightContent={
          <span className="text-[10px] text-muted-foreground/50">
            {data?.stats.totalPosts ?? 0} posts · {analytics?.leads.totalLeads ?? 0} leads · {analytics?.customers.totalUnique ?? 0} customers
          </span>
        }
      />

      {/* ═══ LEAD INSIGHTS TAB ═══ */}
      {activeTab === 'leads' && analytics && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard label="Total Leads" value={analytics.leads.totalLeads} icon={<Users size={14} className="text-violet-500" />} />
            <StatCard label="Hot Leads" value={analytics.leads.hotLeads} icon={<Target size={14} className="text-red-500" />} color="text-red-500" />
            <StatCard label="Avg Score" value={analytics.leads.avgScore} suffix="/100" icon={<BarChart3 size={14} className="text-blue-500" />} />
            <StatCard label="Sources" value={Object.keys(analytics.leads.sourceBreakdown).length} icon={<ArrowUpRight size={14} className="text-green-500" />} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Score Distribution */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Lead Score Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.leads.scoreDistribution.map(bucket => {
                    const max = Math.max(...analytics.leads.scoreDistribution.map(b => b.count), 1);
                    return (
                      <div key={bucket.range} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-12">{bucket.range}</span>
                        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                          <div className="h-full bg-violet-500/70 rounded-full transition-all" style={{ width: `${(bucket.count / max) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{bucket.count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Priority Breakdown */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Priority Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.leads.priorityBreakdown).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        priority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        priority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        priority === 'standard' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-muted text-muted-foreground'
                      }`}>{priority}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source Channels */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Lead Sources</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.leads.sourceBreakdown).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{source.replace(/-/g, ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Leads */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Scoring Leads</CardTitle></CardHeader>
              <CardContent>
                {analytics.leads.topLeads.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No scored leads yet</p>
                ) : (
                  <div className="space-y-2">
                    {analytics.leads.topLeads.map((lead, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{lead.name}</span>
                          {lead.value && <span className="text-xs text-muted-foreground ml-2">${lead.value.toFixed(0)}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                            lead.priority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            lead.priority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-muted text-muted-foreground'
                          }`}>{lead.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ CUSTOMER INSIGHTS TAB ═══ */}
      {activeTab === 'customers' && analytics && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard label="Unique Customers" value={analytics.customers.totalUnique} icon={<Users size={14} className="text-blue-500" />} />
            <StatCard label="Repeat Customers" value={analytics.customers.repeatCustomers} icon={<ArrowUpRight size={14} className="text-green-500" />} />
            <StatCard label="Repeat Rate" value={`${(analytics.customers.repeatRate * 100).toFixed(0)}%`} icon={<TrendingUp size={14} className="text-emerald-500" />} />
            <StatCard label="Avg CLV (1yr)" value={analytics.customers.avgClv1 > 0 ? `$${analytics.customers.avgClv1.toLocaleString()}` : '—'} icon={<BarChart3 size={14} className="text-amber-500" />} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Property Size Distribution */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Property Size Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.customers.sizeBreakdown).sort((a, b) => b[1] - a[1]).map(([size, count]) => {
                    const max = Math.max(...Object.values(analytics.customers.sizeBreakdown), 1);
                    return (
                      <div key={size} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-24 truncate">{size}</span>
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-blue-500/70 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                  {Object.keys(analytics.customers.sizeBreakdown).length === 0 && (
                    <p className="text-xs text-muted-foreground">No property data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><MapPin size={14} /> Service Area Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.customers.topLocations.map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{location.replace(/-/g, ' ')}</span>
                      <span className="font-medium">{count} quotes</span>
                    </div>
                  ))}
                  {analytics.customers.topLocations.length === 0 && (
                    <p className="text-xs text-muted-foreground">No location data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CLV Breakdown */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Customer Lifetime Value</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{analytics.customers.avgClv1 > 0 ? `$${analytics.customers.avgClv1.toLocaleString()}` : '—'}</div>
                    <div className="text-[10px] text-muted-foreground">Avg 1-Year CLV</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{analytics.customers.avgClv3 > 0 ? `$${analytics.customers.avgClv3.toLocaleString()}` : '—'}</div>
                    <div className="text-[10px] text-muted-foreground">Avg 3-Year CLV</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{analytics.customers.totalUnique}</div>
                    <div className="text-[10px] text-muted-foreground">Total Customers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ BUSINESS INTEL TAB ═══ */}
      {activeTab === 'business' && analytics && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <StatCard
              label="MTD Revenue"
              value={`$${analytics.business.mtdRevenue.toLocaleString()}`}
              icon={<TrendingUp size={14} className="text-green-500" />}
              sub={analytics.business.lastMonthRevenue > 0
                ? `${analytics.business.mtdRevenue >= analytics.business.lastMonthRevenue ? '+' : ''}${(((analytics.business.mtdRevenue - analytics.business.lastMonthRevenue) / analytics.business.lastMonthRevenue) * 100).toFixed(0)}% vs last month`
                : undefined}
            />
            <StatCard label="Avg Quote Value" value={`$${analytics.business.avgQuoteValue.toLocaleString()}`} icon={<BarChart3 size={14} className="text-blue-500" />} />
            <StatCard label="Conversion Rate" value={`${(analytics.business.conversionRate * 100).toFixed(1)}%`} icon={<Target size={14} className="text-emerald-500" />} />
            <StatCard label="MTD Quotes" value={analytics.business.mtdQuotes} icon={<ArrowUpRight size={14} className="text-violet-500" />} sub={`${analytics.business.totalQuotes} total`} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Pipeline Health */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Pipeline Health</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.business.statusBreakdown).map(([status, count]) => {
                    const max = Math.max(...Object.values(analytics.business.statusBreakdown), 1);
                    const colors: Record<string, string> = {
                      pending: 'bg-yellow-500/70',
                      contacted: 'bg-blue-500/70',
                      quoted: 'bg-purple-500/70',
                      negotiating: 'bg-orange-500/70',
                      invoiced: 'bg-cyan-500/70',
                      paid: 'bg-green-500/70',
                      won: 'bg-emerald-500/70',
                      lost: 'bg-red-500/70',
                    };
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">{status}</span>
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div className={`h-full rounded-full ${colors[status] ?? 'bg-muted-foreground/40'}`} style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                  {Object.keys(analytics.business.statusBreakdown).length === 0 && (
                    <p className="text-xs text-muted-foreground">No pipeline data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quote Velocity */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Quote Velocity</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-32">
                  {analytics.business.weeklyVelocity.map((week) => {
                    const max = Math.max(...analytics.business.weeklyVelocity.map(w => w.count), 1);
                    const pct = (week.count / max) * 100;
                    return (
                      <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-medium">{week.count}</span>
                        <div className="w-full bg-muted rounded-t overflow-hidden" style={{ height: '100px' }}>
                          <div className="w-full bg-green-500/60 rounded-t mt-auto" style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                        </div>
                        <span className="text-[8px] text-muted-foreground">{week.week}</span>
                      </div>
                    );
                  })}
                </div>
                {analytics.business.weeklyVelocity.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No velocity data yet</p>
                )}
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue Periods</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="text-sm font-semibold">${analytics.business.mtdRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Month</span>
                    <span className="text-sm font-semibold">${analytics.business.lastMonthRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Quarter</span>
                    <span className="text-sm font-semibold">${analytics.business.quarterRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promo Usage */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Promo Code Usage</CardTitle></CardHeader>
              <CardContent>
                {Object.keys(analytics.business.promoUsage).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No promo codes used yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(analytics.business.promoUsage).sort((a, b) => b[1] - a[1]).map(([code, count]) => (
                      <div key={code} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs">{code}</span>
                        <span className="font-medium">{count} uses</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ INDUSTRY TRENDS TAB ═══ */}
      {activeTab === 'industry' && (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Industry Trends — requires external data sources (coming in Wave 3)
        </div>
      )}

      {/* ═══ KNOWLEDGE FEED TAB (existing, unchanged) ═══ */}
      {activeTab === 'feed' && (
      <div className="flex flex-1 overflow-hidden">
      <div className="w-64 border-r overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Topics</h2>
          <span className="text-[10px] text-muted-foreground">{data.stats.totalTopics}</span>
        </div>

        <button
          onClick={() => setSelectedTopic(null)}
          className={`w-full rounded-md px-3 py-2 text-left text-xs font-medium transition-colors mb-1 ${
            !selectedTopic ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          All Posts ({data.stats.totalPosts})
        </button>

        <div className="space-y-1">
          {data.topics.map((topic) => {
            const postCount = data.posts.filter(p => p.topicId === topic.id).length;
            const isGenerating = generating === topic.id;
            return (
              <div key={topic.id} className="group">
                <button
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
                    selectedTopic === topic.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-[10px]">{postCount}</span>
                  </div>
                  <div className="text-[10px] mt-0.5 opacity-60">
                    {topic.source === 'programmatic' ? 'auto-derived' : 'manual'}
                  </div>
                </button>
                {postCount === 0 && (
                  <button
                    onClick={() => handleGenerate(topic.id)}
                    disabled={isGenerating}
                    className="w-full rounded px-3 py-1 text-[10px] text-primary hover:bg-primary/5 disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : '+ Generate with Gemini'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleGenerateAll}
            disabled={generating !== null}
            className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate All (Gemini)'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Knowledge Feed</h1>
            <p className="text-sm text-muted-foreground">
              {selectedTopic ? data.topics.find(t => t.id === selectedTopic)?.name : 'All topics'} — {filteredPosts.length} posts
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold mb-1">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a topic and click &quot;Generate with Gemini&quot; to create your first knowledge article.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const topic = data.topics.find(t => t.id === post.topicId);
            return (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    {topic && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{topic.name}</span>}
                    <span className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()} — {post.source}</span>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium text-foreground/90">{post.summary}</p>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{post.body}</div>
                  <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Why This Matters</div>
                    <p className="text-sm">{post.whyItMatters}</p>
                  </div>
                  {post.suggestedActions.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Suggested Actions</div>
                      <div className="flex flex-wrap gap-2">
                        {post.suggestedActions.map((action, i) => (
                          <span key={i} className="rounded-full border px-3 py-1 text-xs hover:bg-muted cursor-pointer transition-colors">{action}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="w-72 border-l overflow-y-auto p-4">
        <h3 className="text-sm font-semibold mb-3">Feed Intelligence</h3>
        <Card className="mb-4">
          <CardContent className="p-3 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Topics</span><span className="font-medium">{data.stats.totalTopics}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Posts</span><span className="font-medium">{data.stats.totalPosts}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Enabled</span><span className="font-medium">{data.stats.enabledTopics}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Engine</span><span className="font-medium text-primary">Multi-model</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Backend</span><span className="font-medium">Dbity via Orcbase</span></div>
          </CardContent>
        </Card>

        <h3 className="text-sm font-semibold mb-2">Recent Runs</h3>
        {data.runs.length === 0 ? (
          <p className="text-xs text-muted-foreground">No generation runs yet.</p>
        ) : (
          <div className="space-y-2">
            {data.runs.slice(-5).reverse().map((run) => {
              const topic = data.topics.find(t => t.id === run.topicId);
              return (
                <div key={run.id} className="rounded border p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic?.name ?? run.topicId}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                      run.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      run.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      run.status === 'running' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-muted text-muted-foreground'
                    }`}>{run.status}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{run.postsGenerated} posts — {new Date(run.startedAt).toLocaleTimeString()}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
      )}

      {/* Analytics loading state for non-feed tabs */}
      {['leads', 'customers', 'business'].includes(activeTab) && !analytics && (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Loading analytics...</div>
      )}
    </div>
  );
}

// ── Reusable stat card ──────────────────────────────────────────
function StatCard({ label, value, icon, color, suffix, sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; suffix?: string; sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{label}</span>
          {icon}
        </div>
        <div className={`text-xl font-bold ${color ?? ''}`}>
          {value}{suffix && <span className="text-xs text-muted-foreground font-normal">{suffix}</span>}
        </div>
        {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
}
