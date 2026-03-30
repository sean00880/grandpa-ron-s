'use client';

/**
 * Hosting Dashboard — DeployOS via WebDevOS (ArcOrc UI) + TryLLM (Agent System)
 *
 * Architecture:
 *   ArcOrc: SurfaceHeader + useSurfaceTab (layout primitives)
 *   TryLLM: Agent-assisted deploy via /api/studio/chat
 *   DeployOS: Coolify + Cloudflare + NameSilo (proprietary orchestration)
 *   Dbity: Backend engine for all hosting data
 *
 * This is a WebDevOS surface — same architecture as Studio, CRM, Operations.
 * Agent commands (via TryLLM): "deploy to production", "add domain", "check SSL"
 */

import { useState, useEffect } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent } from '@/components/ui/card';

const HOSTING_TABS = [
  { id: 'overview', label: 'Overview', color: '#8b5cf6' },
  { id: 'domains', label: 'Domains' },
  { id: 'deploys', label: 'Deploys' },
  { id: 'assist', label: 'AI Assist' },
  { id: 'settings', label: 'Settings' },
];

interface HostingConfig {
  project: { name: string; status: string; framework: string; git_repo: string; git_branch: string; root_directory: string };
  domain: { primary: string; ssl_status: string; cdn_enabled: boolean; cdn_provider: string };
  deployment: { provider: string; status: string };
  infrastructure: { backend: string; database: string; auth: string; tier: string };
  deployos: Record<string, boolean>;
}

export default function HostingPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('overview', ['overview', 'domains', 'deploys', 'settings'] as const);
  const [config, setConfig] = useState<HostingConfig | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ domain: string; available: boolean; price_usd: number }>>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch('/api/hosting').then(r => r.ok ? r.json() : null).then(d => { if (d) setConfig(d); }).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    setSearching(true);
    try {
      const res = await fetch('/api/hosting?action=domain-search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: searchName.trim() }),
      });
      const data = await res.json();
      setSearchResults(data.results ?? []);
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader title="HOSTING" titleColor="#8b5cf6" tabs={HOSTING_TABS} activeTab={activeTab}
        onTabChange={setActiveTab as (id: string) => void}
        rightContent={config ? <span className="text-[10px] text-muted-foreground/50">via {config.deployment.provider} | {config.infrastructure.backend}</span> : null}
      />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && config && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Card><CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Domain</div>
                <div className="text-lg font-bold">{config.domain.primary}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-[10px] text-green-500">SSL {config.domain.ssl_status}</span>
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Provider</div>
                <div className="text-lg font-bold capitalize">{config.deployment.provider}</div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${config.deployment.status === 'ready' ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/15 text-yellow-500'}`}>{config.deployment.status}</span>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Backend</div>
                <div className="text-lg font-bold capitalize">{config.infrastructure.backend}</div>
                <div className="text-[10px] text-muted-foreground">{config.infrastructure.database} | {config.infrastructure.auth}</div>
              </CardContent></Card>
            </div>
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Project</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Repo:</span> <span className="font-mono">{config.project.git_repo}</span></div>
                <div><span className="text-muted-foreground">Branch:</span> <span className="font-mono">{config.project.git_branch}</span></div>
                <div><span className="text-muted-foreground">Root:</span> <span className="font-mono">{config.project.root_directory}</span></div>
                <div><span className="text-muted-foreground">Framework:</span> {config.project.framework}</div>
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">DeployOS Status</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(config.deployos).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${val ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                    <span className="text-muted-foreground">{key.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="space-y-4">
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Search and Buy a Domain</h3>
              <div className="flex gap-2">
                <input value={searchName} onChange={e => setSearchName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter domain name (e.g. mybusiness)"
                  className="flex-1 rounded border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50" />
                <button onClick={handleSearch} disabled={searching}
                  className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50">
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {searchResults.map(r => (
                    <div key={r.domain} className="flex items-center justify-between py-2 px-3 rounded border border-border">
                      <span className="font-mono text-sm">{r.domain}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">${r.price_usd}</span>
                        {r.available ? (
                          <button className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500">Buy + Deploy</button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Taken</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3">Current Domains</h3>
              <div className="flex items-center justify-between py-2 px-3 rounded border border-border">
                <div>
                  <span className="font-mono text-sm">{config?.domain.primary ?? 'grandparons.com'}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">Primary</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-500">SSL</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-500">CDN</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Cloudflare</span>
              </div>
            </CardContent></Card>
          </div>
        )}

        {activeTab === 'deploys' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Deployments</h2>
              <button className="rounded bg-purple-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-purple-500">Redeploy</button>
            </div>
            {[
              { id: 'dep-1', status: 'ready', commit: 'WorkGun CRM + Studio v2', time: '2m ago' },
              { id: 'dep-2', status: 'ready', commit: 'DeployOS framework', time: '15m ago' },
              { id: 'dep-3', status: 'error', commit: 'Vercel monorepo fix', time: '1h ago' },
            ].map(d => (
              <Card key={d.id}><CardContent className="p-4 flex items-center gap-4">
                <span className={`h-3 w-3 rounded-full ${d.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{d.commit}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">main</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${d.status === 'ready' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>{d.status}</span>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{d.time}</div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )}

        {activeTab === 'assist' && (
          <AgentAssistTab />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Hosting Settings</h2>
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-2">DeployOS Configuration</h3>
              <p className="text-xs text-muted-foreground mb-3">Set these env vars to enable full DeployOS:</p>
              <div className="space-y-1.5 font-mono text-xs">
                {['COOLIFY_URL', 'COOLIFY_TOKEN', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ZONE_ID', 'NAMESILO_API_KEY', 'HETZNER_SERVER_IP'].map(env => (
                  <div key={env} className="py-1 border-b border-border/50">{env}</div>
                ))}
              </div>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-2">Migration Path</h3>
              <p className="text-xs text-muted-foreground">Current: Vercel ($20+/mo). Target: DeployOS ($4.50/mo).</p>
              <p className="text-xs text-muted-foreground mt-1">Provision Hetzner server + install Coolify to migrate.</p>
            </CardContent></Card>
          </div>
        )}

        {!config && activeTab === 'overview' && (
          <div className="text-center py-16 text-muted-foreground">Loading hosting configuration...</div>
        )}
      </div>
    </div>
  );
}

/**
 * AI Assist Tab — TryLLM Agent for REASONING ONLY (not execution).
 *
 * Separation of concerns (LAW-DEPLOY-AGENT-001):
 *   AUTOMATED (deterministic): Deploy, DNS, SSL, build — Coolify webhooks + Cloudflare API
 *   AGENTIC (TryLLM): Failure triage, domain suggestions, migration planning — reasoning only
 *
 * The agent PROPOSES actions. The user clicks buttons to EXECUTE via deterministic APIs.
 * The agent NEVER directly triggers deploys, DNS changes, or purchases.
 */
function AgentAssistTab() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: 'I can help you reason about hosting decisions. I analyze and suggest — you execute via the automated controls.\n\nTry asking:\n- "Why did my last deploy fail?"\n- "What domain names work for a lawn care business?"\n- "Plan my migration from Vercel to Coolify"\n- "Compare hosting costs for my setup"\n- "What SSL configuration do I need?"\n\nNote: I suggest actions. You execute them via the Overview/Domains/Deploys tabs (deterministic automation).' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }].map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          origin: 'ai_core',
          scope_id: 'grandpa-ron',
        }),
      });
      const data = await res.json();
      const assistantContent = data.parts?.map((p: any) => p.content).join('\n') ?? data.error ?? 'No response';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to reach AI agent. Ensure /api/studio/chat is available.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] rounded bg-purple-500/15 text-purple-400 px-2 py-0.5">TryLLM Agent</span>
        <span className="text-[10px] text-muted-foreground">AI-assisted deployment via DeployOS</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`rounded-lg p-3 text-sm ${
            msg.role === 'user'
              ? 'bg-purple-500/10 border border-purple-500/20 ml-12'
              : 'bg-card border border-border mr-12'
          }`}>
            <div className="text-[10px] text-muted-foreground mb-1 font-medium">
              {msg.role === 'user' ? 'You' : 'DeployOS Agent'}
            </div>
            <div className="whitespace-pre-wrap text-foreground/80">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bg-card border border-border rounded-lg p-3 mr-12">
            <div className="text-[10px] text-muted-foreground mb-1">DeployOS Agent</div>
            <div className="text-sm text-muted-foreground animate-pulse">Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask the deploy agent... (e.g. &quot;deploy to production&quot;)"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
