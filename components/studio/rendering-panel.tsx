'use client';

/**
 * Rendering Panel — Canonical rendering environment.
 *
 * Code: live mutation stream (WCG-driven, not static)
 * Preview: live app render (bound to execution lineage)
 *
 * LAW-WEBDEVOS-002: One canonical rendering environment.
 * Both surfaces derive from SAME WCG state and execution lineage.
 */

import { useState } from 'react';
import { useStudio } from '@/app/dashboard/studio/studio-context';
import { runFullEnforcement } from '@growsz/wcg-core';
import { BlockRenderer } from './block-renderer';

export function RenderingPanel() {
  const { renderTab, setRenderTab, projectView, snapshot, wcg } = useStudio();
  const enforcement = runFullEnforcement(wcg);
  const isCMS = projectView === 'cms';

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab bar — shared between AI Core and CMS */}
      <div className="flex items-center gap-1 border-b border-border px-4 py-1.5">
        {(['code', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setRenderTab(tab)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              renderTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground/70 hover:text-foreground/80'
            }`}
          >
            {isCMS && tab === 'code' ? 'Inspector' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[10px]">
          <span className={`px-1.5 py-0.5 rounded ${isCMS ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
            {isCMS ? 'CMS' : 'AI Core'}
          </span>
          <span className={enforcement.passed ? 'text-green-600' : 'text-red-500'}>
            {enforcement.passed ? '● OK' : `● ${enforcement.blocking_violations} blocks`}
          </span>
          <span className="text-muted-foreground/30">{Object.keys(snapshot.nodes).length}n / {snapshot.edges.length}e</span>
        </div>
      </div>

      {/* Content — same rendering environment, surface-aware code tab */}
      <div className="flex-1 overflow-hidden">
        {renderTab === 'code' ? <CodeSurface /> : <PreviewSurface />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code Surface — Live WCG mutation stream
// ---------------------------------------------------------------------------

function CodeSurface() {
  const { snapshot, projectView } = useStudio();
  const isCMS = projectView === 'cms';
  const nodes = Object.values(snapshot.nodes);

  if (isCMS) {
    // CMS Inspector: shows node graph summary + recent mutations
    const pages = nodes.filter(n => n.type === 'page');
    const blocks = nodes.filter(n => n.type === 'block');
    const components = nodes.filter(n => n.type === 'component');
    const cmsNodes = nodes.filter(n => n.metadata?.interface_origin === 'cms');

    return (
      <div className="h-full overflow-auto bg-card p-4 text-sm">
        <div className="text-cyan-400/70 text-[10px] font-semibold uppercase tracking-wider mb-3">CMS Inspector</div>

        {/* Graph summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded border border-border p-2 text-center">
            <div className="text-lg font-bold text-foreground/80">{pages.length}</div>
            <div className="text-[10px] text-muted-foreground">Pages</div>
          </div>
          <div className="rounded border border-border p-2 text-center">
            <div className="text-lg font-bold text-foreground/80">{blocks.length}</div>
            <div className="text-[10px] text-muted-foreground">Blocks</div>
          </div>
          <div className="rounded border border-border p-2 text-center">
            <div className="text-lg font-bold text-foreground/80">{components.length}</div>
            <div className="text-[10px] text-muted-foreground">Components</div>
          </div>
        </div>

        {/* Recent CMS mutations */}
        <div className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
          CMS Mutations ({cmsNodes.length})
        </div>
        {cmsNodes.slice(-8).map(node => (
          <div key={node.id} className="mb-1.5 rounded border border-cyan-500/20 p-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-cyan-400 font-medium">{node.type}</span>
              <span className="text-muted-foreground/50">→</span>
              <span className="text-foreground/70">{node.display_name ?? node.name}</span>
            </div>
            <div className="text-[9px] text-muted-foreground/30 mt-0.5">{new Date(node.updated_at).toLocaleTimeString()}</div>
          </div>
        ))}
        {cmsNodes.length === 0 && (
          <div className="text-muted-foreground/30 text-xs">Add blocks from the palette to see CMS mutations here.</div>
        )}

        {/* Style quick reference */}
        <div className="mt-4 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Design Tokens</div>
        <div className="space-y-1">
          {[
            { token: '--background', value: 'hsl(var(--background))', preview: 'bg-background' },
            { token: '--primary', value: 'hsl(var(--primary))', preview: 'bg-primary' },
            { token: '--muted', value: 'hsl(var(--muted))', preview: 'bg-muted' },
            { token: '--accent', value: 'hsl(var(--accent))', preview: 'bg-accent' },
          ].map(t => (
            <div key={t.token} className="flex items-center gap-2 text-[10px]">
              <div className={`h-3 w-3 rounded ${t.preview} border border-border`} />
              <span className="font-mono text-muted-foreground/50">{t.token}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // AI Core: mutation stream (existing behavior)
  const recentNodes = nodes.slice(-10);
  return (
    <div className="h-full overflow-auto bg-card p-4 font-mono text-sm">
      <div className="text-muted-foreground/50 mb-3">{'// Live WCG mutation stream — bound to canonical state'}</div>
      <div className="text-muted-foreground/30 mb-4 text-[10px]">
        Scope: {snapshot.scope_id} | Version: {snapshot.version} | Mutations: {snapshot.mutation_log_tail.length}
      </div>
      {recentNodes.map((node) => (
        <div key={node.id} className="mb-2 rounded border border-border/60 p-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-purple-400 font-semibold">{node.type}</span>
            <span className="text-muted-foreground/70">→</span>
            <span className="text-green-400">{node.display_name ?? node.name}</span>
            <span className="ml-auto text-muted-foreground/30 text-[10px]">v{node.version}</span>
          </div>
          {node.metadata.interface_origin && (
            <div className="mt-0.5 text-[10px] text-muted-foreground/30">
              origin: {node.metadata.interface_origin} | {new Date(node.updated_at).toLocaleTimeString()}
            </div>
          )}
          <div className="mt-0.5 text-[9px] text-muted-foreground/20 font-mono truncate">{node.id}</div>
        </div>
      ))}
      {nodes.length === 0 && (
        <div className="text-muted-foreground/30">Waiting for mutations from AI Core or CMS...</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview Surface — Live rendered application with responsive controls
// ---------------------------------------------------------------------------

function PreviewSurface() {
  const { projectView, snapshot, selectedPageId, setSelectedPageId } = useStudio();
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const widthMap = { desktop: '100%', tablet: '768px', mobile: '375px' };
  const isCMS = projectView === 'cms';

  // CMS mode: show visual block renderer instead of iframe
  if (isCMS && selectedPageId) {
    const pageBlocks = Object.values(snapshot.nodes).filter(n => n.parent_id === selectedPageId);

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 border-b border-border px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          <div className="flex-1 rounded bg-muted px-2 py-0.5 text-xs font-mono text-cyan-400/70">
            CMS Preview &mdash; {snapshot.nodes[selectedPageId]?.display_name ?? 'Page'}
          </div>
          <div className="flex items-center gap-0.5">
            {(['desktop', 'tablet', 'mobile'] as const).map(vp => (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${viewport === vp ? 'bg-muted text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
              >
                {vp === 'desktop' ? 'D' : vp === 'tablet' ? 'T' : 'M'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center bg-background overflow-auto">
          <div style={{ width: widthMap[viewport], maxWidth: '100%' }} className="transition-all duration-300">
            <BlockRenderer
              blocks={pageBlocks}
              selectedNodeId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          </div>
        </div>
      </div>
    );
  }

  // AI Core + non-CMS: iframe preview
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <div className="flex-1 rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground/70">
          http://localhost:3000
        </div>
        <div className="flex items-center gap-0.5">
          {(['desktop', 'tablet', 'mobile'] as const).map(vp => (
            <button
              key={vp}
              onClick={() => setViewport(vp)}
              className={`px-1.5 py-0.5 rounded text-[10px] ${viewport === vp ? 'bg-muted text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}
            >
              {vp === 'desktop' ? 'D' : vp === 'tablet' ? 'T' : 'M'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex justify-center bg-muted/30 overflow-hidden">
        <iframe
          src="/"
          style={{ width: widthMap[viewport], maxWidth: '100%', height: '100%' }}
          className="border-0 bg-background transition-all duration-300"
          title={`Live Preview — ${projectView === 'cms' ? 'CMS' : 'AI Core'}`}
        />
      </div>
    </div>
  );
}
