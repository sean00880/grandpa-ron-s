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

import { useStudio } from '@/app/dashboard/studio/layout';
import { runFullEnforcement } from '@growsz/wcg-core';

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
  const { snapshot } = useStudio();
  const nodes = Object.values(snapshot.nodes);
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
// Preview Surface — Live rendered application
// ---------------------------------------------------------------------------

function PreviewSurface() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <div className="flex-1 rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground/70">
          http://localhost:3000
        </div>
      </div>
      <div className="flex-1">
        <iframe
          src="/"
          className="h-full w-full border-0"
          title="Live Preview — Grandpa Ron's"
        />
      </div>
    </div>
  );
}
