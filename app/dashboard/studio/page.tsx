'use client';

/**
 * Studio Page — Assembles the ArcOrc-native development environment.
 *
 * Layout (from docs/images/arcorc_concept/Dev.png):
 *   [Workspace Sidebar] | [Primary Column] | [Rendering Column (Dev mode)]
 *   [Execution Dock (bottom)]
 *
 * Project Views:
 *   Core → AI conversation + rendering
 *   CMS → Visual editor (SAME WCG state — equal bearing)
 *   Pipelines → SPBVG pipeline board
 *   Workflows → Dependency graph
 *   Automations → Automation canvas
 *
 * All state flows through WCGStore (LAW-WCG-002).
 * No interface owns state. All mutations via MutationBuilder.
 */

import { useState } from 'react';
import { useStudio } from './layout';
import { StudioTopBar } from '@/components/studio/studio-top-bar';
import { WorkspaceSidebar } from '@/components/studio/workspace-sidebar';
import { ConversationPanel } from '@/components/studio/conversation-panel';
import { RenderingPanel } from '@/components/studio/rendering-panel';
import { ExecutionDock } from '@/components/studio/execution-dock';

export default function StudioPage() {
  const { mode, projectView, snapshot, applyMutation, createBuilder } = useStudio();
  const isDev = mode === 'dev';

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-background">
      {/* Top Bar */}
      <StudioTopBar />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Workspace Sidebar (Files / Chat / Tasks) */}
        <WorkspaceSidebar />

        {/* Primary Column */}
        <div className={`flex flex-col ${isDev && (projectView === 'core' || projectView === 'cms') ? 'w-[35%]' : 'flex-1'} border-r border-border`}>
          {projectView === 'core' && <ConversationPanel />}
          {projectView === 'cms' && <CMSView />}
          {projectView === 'pipelines' && <PipelinesView />}
          {projectView === 'workflows' && <WorkflowsView />}
          {projectView === 'automations' && <AutomationsView />}
        </div>

        {/* Rendering Column (Dev mode — Core AND CMS get rendering) */}
        {isDev && (projectView === 'core' || projectView === 'cms') && (
          <div className="flex-1">
            <RenderingPanel />
          </div>
        )}
      </div>

      {/* Execution Dock (bottom) */}
      <ExecutionDock />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CMS View — EQUAL BEARING (same WCG state, same mutation protocol)
// ---------------------------------------------------------------------------

function CMSView() {
  const { snapshot, applyMutation, createBuilder } = useStudio();
  const pages = Object.values(snapshot.nodes).filter(n => n.type === 'page');
  const layouts = Object.values(snapshot.nodes).filter(n => n.type === 'layout');
  const components = Object.values(snapshot.nodes).filter(n => n.type === 'component');
  const blocks = Object.values(snapshot.nodes).filter(n => n.type === 'block');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(pages[0]?.id ?? null);
  const selectedNode = selectedNodeId ? snapshot.nodes[selectedNodeId] : null;

  const handleAddPage = () => {
    const builder = createBuilder('cms');
    const result = applyMutation(builder.createNode({
      type: 'page',
      name: `page-${Date.now().toString(36)}`,
      display_name: 'New Page',
      props: { path: `/new-${Date.now().toString(36)}`, title: 'New Page' },
    }));
    if (result.status === 'applied' && result.affected_nodes[0]) setSelectedPageId(result.affected_nodes[0]);
  };

  const handleAddBlock = (blockType: string, displayName: string, extraProps?: Record<string, unknown>) => {
    if (!selectedPageId) return;
    const builder = createBuilder('cms');
    const result = applyMutation(builder.createNode({
      type: blockType === 'integration' ? 'component' : 'block',
      name: `${blockType}-${Date.now().toString(36)}`,
      display_name: displayName,
      parent_id: selectedPageId,
      props: { block_type: blockType, ...extraProps },
    }));
    if (result.status === 'applied' && result.affected_nodes[0]) setSelectedNodeId(result.affected_nodes[0]);
  };

  const handleUpdateProps = (key: string, value: unknown) => {
    if (!selectedNode) return;
    const builder = createBuilder('cms');
    if (key === 'display_name') {
      applyMutation(builder.updateNode(selectedNode.id, { display_name: String(value) }));
    } else {
      applyMutation(builder.updateProps(selectedNode.id, { ...selectedNode.props, [key]: value }));
    }
  };

  // Blocks that belong to selected page
  const pageChildren = selectedPageId
    ? Object.values(snapshot.nodes).filter(n => n.parent_id === selectedPageId)
    : [];

  // Standard blocks
  const BLOCK_PALETTE = [
    { type: 'hero', label: 'Hero', icon: '🏔' },
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼' },
    { type: 'cta', label: 'CTA', icon: '👆' },
    { type: 'cards', label: 'Cards', icon: '🃏' },
    { type: 'form', label: 'Form', icon: '📋' },
    { type: 'nav', label: 'Nav', icon: '🧭' },
    { type: 'footer', label: 'Footer', icon: '🦶' },
    { type: 'gallery', label: 'Gallery', icon: '🎨' },
    { type: 'reviews', label: 'Reviews', icon: '⭐' },
    { type: 'map', label: 'Map', icon: '📍' },
    { type: 'pricing', label: 'Pricing', icon: '💰' },
  ];

  // WorkGun integrations (from registry)
  const WORKGUN_INTEGRATIONS = [
    { id: 'workgun:quote-form', label: 'Quote Builder', icon: '📊', tier: 'starter' },
    { id: 'workgun:customer-portal', label: 'Customer Portal', icon: '🏠', tier: 'starter' },
    { id: 'workgun:invoice-gen', label: 'Invoice Gen', icon: '🧾', tier: 'starter' },
    { id: 'workgun:review-collector', label: 'Review Collector', icon: '⭐', tier: 'starter' },
    { id: 'workgun:dispatch-board', label: 'Dispatch Board', icon: '🚛', tier: 'professional' },
    { id: 'workgun:crew-calendar', label: 'Crew Calendar', icon: '📅', tier: 'professional' },
    { id: 'workgun:team-inbox', label: 'Team Inbox', icon: '📬', tier: 'professional' },
    { id: 'workgun:property-audit', label: 'Property Audit', icon: '🔍', tier: 'professional' },
  ];

  return (
    <div className="flex h-full">
      {/* Left: Page Tree + Page Content */}
      <div className="w-56 border-r border-border overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Pages ({pages.length})</span>
            <button onClick={handleAddPage} className="rounded bg-cyan-600 px-1.5 py-0.5 text-[9px] font-medium text-white hover:bg-cyan-500">+ Page</button>
          </div>
          {pages.map(p => (
            <div
              key={p.id}
              onClick={() => { setSelectedPageId(p.id); setSelectedNodeId(null); }}
              className={`rounded px-2 py-1.5 text-xs cursor-pointer transition-colors ${
                selectedPageId === p.id ? 'bg-cyan-500/15 text-cyan-400 font-medium' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {p.display_name ?? p.name}
              {selectedPageId === p.id && (
                <div className="mt-1 pl-2 border-l border-cyan-500/30">
                  {pageChildren.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground/40 py-1">No blocks — drag from palette →</div>
                  ) : (
                    pageChildren.map(child => (
                      <div
                        key={child.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(child.id); }}
                        className={`rounded px-1.5 py-0.5 text-[11px] cursor-pointer ${
                          selectedNodeId === child.id ? 'bg-purple-500/15 text-purple-400' : 'text-muted-foreground/60 hover:text-muted-foreground'
                        }`}
                      >
                        {child.display_name ?? child.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-3 pb-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Layouts ({layouts.length})</div>
          {layouts.map(l => (
            <div key={l.id} className="px-2 py-0.5 text-xs text-muted-foreground/60">{l.display_name ?? l.name}</div>
          ))}
          <div className="mt-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Components ({components.length})</div>
          {components.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedNodeId(c.id)}
              className={`px-2 py-0.5 text-xs cursor-pointer ${
                selectedNodeId === c.id ? 'text-purple-400' : 'text-muted-foreground/60 hover:text-muted-foreground'
              }`}
            >
              {c.display_name ?? c.name}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Properties Panel (selected node) OR empty state */}
      <div className="flex-1 overflow-y-auto">
        {selectedNode ? (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400">{selectedNode.type}</span>
              <span className="text-sm font-medium text-foreground/80">{selectedNode.display_name ?? selectedNode.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground/30">v{selectedNode.version}</span>
            </div>

            {/* Editable properties */}
            <div className="space-y-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Properties</div>
              <PropField label="Display Name" value={selectedNode.display_name ?? ''} onChange={v => handleUpdateProps('display_name', v)} />
              {selectedNode.type === 'page' && (
                <PropField label="Path" value={String(selectedNode.props?.path ?? '')} onChange={v => handleUpdateProps('path', v)} />
              )}
              {selectedNode.type === 'block' && (
                <>
                  <PropField label="Block Type" value={String(selectedNode.props?.block_type ?? '')} onChange={v => handleUpdateProps('block_type', v)} />
                  <PropField label="Content" value={String(selectedNode.props?.content ?? '')} onChange={v => handleUpdateProps('content', v)} textarea />
                </>
              )}
              {selectedNode.type === 'component' && selectedNode.props?.integration_id && (
                <div className="rounded bg-cyan-500/10 p-2 text-xs text-cyan-400">
                  WorkGun Integration: {String(selectedNode.props.integration_id)}
                </div>
              )}

              {/* Raw props display */}
              <div className="mt-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">All Props</div>
                <pre className="rounded bg-card p-2 text-[10px] text-muted-foreground/60 font-mono overflow-auto max-h-40">
                  {JSON.stringify(selectedNode.props ?? {}, null, 2)}
                </pre>
              </div>

              <div className="text-[10px] text-muted-foreground/30 mt-2">
                origin: {selectedNode.metadata?.interface_origin ?? 'system'} | id: {selectedNode.id}
              </div>
            </div>
          </div>
        ) : selectedPageId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <div className="text-sm font-medium text-cyan-400 mb-1">Select a block or add one</div>
              <p className="text-xs text-muted-foreground/50">
                Click blocks in the page tree, or drag from the palette to add content.
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground/30">
                {pages.length} pages / {components.length} components / {blocks.length} blocks
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground/50">
            Select a page to start editing
          </div>
        )}
      </div>

      {/* Right: Block Palette + WorkGun Integrations */}
      <div className="w-52 border-l border-border overflow-y-auto p-3">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Blocks</div>
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {BLOCK_PALETTE.map(b => (
            <button
              key={b.type}
              onClick={() => handleAddBlock(b.type, b.label)}
              disabled={!selectedPageId}
              className="rounded border border-border p-1.5 text-center text-[10px] text-muted-foreground/70 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <div>{b.icon}</div>
              <div>{b.label}</div>
            </button>
          ))}
        </div>

        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400/70">WorkGun</div>
        <div className="space-y-1">
          {WORKGUN_INTEGRATIONS.map(wg => (
            <button
              key={wg.id}
              onClick={() => handleAddBlock('integration', wg.label, { integration_id: wg.id, variant: 'embedded' })}
              disabled={!selectedPageId}
              className="w-full rounded border border-cyan-500/20 p-1.5 text-left text-[10px] hover:bg-cyan-500/10 hover:border-cyan-500/40 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="mr-1">{wg.icon}</span>
              <span className="text-cyan-400">{wg.label}</span>
              <span className="ml-1 text-muted-foreground/30">({wg.tier})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PropField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const El = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="block text-[10px] font-medium text-muted-foreground/70 mb-0.5">{label}</label>
      <El
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground/80 focus:outline-none focus:border-purple-500/50 ${textarea ? 'min-h-[60px] resize-y' : ''}`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline / Workflow / Automation Views
// ---------------------------------------------------------------------------

function PipelinesView() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm font-semibold text-muted-foreground mb-2">Pipelines</div>
        <div className="flex gap-2 justify-center text-xs">
          {['Scout', 'Plan', 'Build', 'Validate', 'Govern'].map((phase) => (
            <div key={phase} className="rounded border border-border px-3 py-2 text-muted-foreground/70">
              <div className="font-medium">{phase}</div>
              <div className="mt-1 h-1 rounded-full bg-muted" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/30">SPBVG pipeline — bound to execution envelopes</p>
      </div>
    </div>
  );
}

function WorkflowsView() {
  return (
    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/70">
      Workflows — dependency graphs bound to CST
    </div>
  );
}

function AutomationsView() {
  return (
    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/70">
      Automations — canvas view bound to WCG automation nodes
    </div>
  );
}
