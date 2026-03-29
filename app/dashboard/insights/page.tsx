'use client';

/**
 * Insights — Knowledge Feed powered by Gemini + Dbity (via Orcbase).
 *
 * 3-column layout:
 *   Left: Topics (manual + programmatic)
 *   Center: Feed cards (generated posts)
 *   Right: Actions + metadata
 *
 * Each post shows: title, summary, body, why it matters, timestamp, actions.
 * Gemini generates content. Dbity persists it via Orcbase in-memory store.
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurfaceHeader, type SurfaceTab } from '@growsz/arcorc-layout';
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

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [data, setData] = useState<InsightsData | null>(null);
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

  useEffect(() => { fetchData(); }, [fetchData]);

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
        <div className="text-sm text-muted-foreground">Loading Knowledge Feed...</div>
      </div>
    );
  }

  const filteredPosts = selectedTopic
    ? data.posts.filter(p => p.topicId === selectedTopic)
    : data.posts;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      {/* Surface Header with Insights tabs */}
      <SurfaceHeader
        title="INSIGHTS"
        titleColor="#22c55e"
        tabs={INSIGHTS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightContent={
          <span className="text-[10px] text-muted-foreground/50">
            {data?.stats.totalPosts ?? 0} posts · {data?.stats.enabledTopics ?? 0} topics
          </span>
        }
      />

      {/* Tab content */}
      {activeTab !== 'feed' && (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          {INSIGHTS_TABS.find(t => t.id === activeTab)?.label} — coming soon
        </div>
      )}

      {activeTab === 'feed' && (
      <div className="flex flex-1 overflow-hidden">
      {/* ═══ LEFT: Topics ═══ */}
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
                    selectedTopic === topic.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
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

      {/* ═══ CENTER: Feed Cards ═══ */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Knowledge Feed</h1>
            <p className="text-sm text-muted-foreground">
              {selectedTopic
                ? data.topics.find(t => t.id === selectedTopic)?.name
                : 'All topics'
              } — {filteredPosts.length} posts
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
                    {topic && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {topic.name}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()} — {post.source}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium text-foreground/90">{post.summary}</p>

                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.body}
                  </div>

                  <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
                      Why This Matters
                    </div>
                    <p className="text-sm">{post.whyItMatters}</p>
                  </div>

                  {post.suggestedActions.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Suggested Actions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.suggestedActions.map((action, i) => (
                          <span key={i} className="rounded-full border px-3 py-1 text-xs hover:bg-muted cursor-pointer transition-colors">
                            {action}
                          </span>
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

      {/* ═══ RIGHT: Actions + Metadata ═══ */}
      <div className="w-72 border-l overflow-y-auto p-4">
        <h3 className="text-sm font-semibold mb-3">Feed Intelligence</h3>

        <Card className="mb-4">
          <CardContent className="p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Topics</span>
              <span className="font-medium">{data.stats.totalTopics}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Posts</span>
              <span className="font-medium">{data.stats.totalPosts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enabled</span>
              <span className="font-medium">{data.stats.enabledTopics}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-medium text-primary">Gemini 2.0 Flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium">Dbity via Orcbase</span>
            </div>
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
                    }`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {run.postsGenerated} posts — {new Date(run.startedAt).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h3 className="text-sm font-semibold mt-6 mb-2">Architecture</h3>
        <div className="rounded border p-3 text-[10px] text-muted-foreground space-y-1 font-mono">
          <div>Topic → Query → Gemini → Post</div>
          <div>Persist: Dbity (Orcbase in-mem)</div>
          <div>Model: gemini-2.0-flash</div>
          <div>Source: programmatic (services)</div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
