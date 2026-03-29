'use client';

/**
 * Studio Top Bar — Uses centralized SurfaceHeader.
 * Route-specific tabs: Core, CMS, Pipelines, Workflows, Automations
 * Theme-aware via ShadCN CSS variables.
 */

import { useStudio, type StudioMode, type ProjectView } from '@/app/dashboard/studio/studio-context';
import { SurfaceHeader, type SurfaceTab } from '@/components/surface-header';

const STUDIO_TABS: SurfaceTab[] = [
  { id: 'core', label: 'AI Core', color: '#8b5cf6' },
  { id: 'cms', label: 'CMS', color: '#06b6d4' },
  { id: 'pipelines', label: 'Pipelines', color: '#f59e0b' },
  { id: 'workflows', label: 'Workflows', color: '#10b981' },
  { id: 'automations', label: 'Automations', color: '#f97316' },
];

export function StudioTopBar() {
  const { mode, setMode, projectView, setProjectView, snapshot, undo, redo, canUndo, canRedo } = useStudio();
  const nodeCount = Object.keys(snapshot.nodes).length;

  return (
    <SurfaceHeader
      title="STUDIO"
      titleColor="#8b5cf6"
      tabs={STUDIO_TABS}
      activeTab={projectView}
      onTabChange={(id) => setProjectView(id as ProjectView)}
      leftContent={
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as StudioMode)}
            className="rounded border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            <option value="regular">Regular</option>
            <option value="dev">Dev</option>
          </select>
          <span className="text-xs text-muted-foreground/50">|</span>
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Undo (Cmd+Z)"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30"
            title="Redo (Cmd+Shift+Z)"
          >
            ↪
          </button>
          <span className="text-[10px] text-muted-foreground/50">WCG: {nodeCount}n</span>
        </div>
      }
    />
  );
}
