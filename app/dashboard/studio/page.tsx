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

import React, { useState } from 'react';
import { useStudio } from './studio-context';
import type { WCGNodeId } from '@growsz/wcg-core';
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
  const { snapshot, applyMutation, createBuilder, undo, redo, canUndo, canRedo, selectedPageId, setSelectedPageId } = useStudio();
  const pages = Object.values(snapshot.nodes).filter(n => n.type === 'page');
  const layouts = Object.values(snapshot.nodes).filter(n => n.type === 'layout');
  const components = Object.values(snapshot.nodes).filter(n => n.type === 'component');
  const blocks = Object.values(snapshot.nodes).filter(n => n.type === 'block');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  // snapshot.nodes is keyed by WCGNodeId (a branded string). Cast is safe
  // because selectedNodeId was set from node IDs returned by the WCG store.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedNode = selectedNodeId ? (snapshot.nodes as any)[selectedNodeId] : null;

  // Set default page on first render
  if (!selectedPageId && pages.length > 0) setSelectedPageId(pages[0].id);

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
      parent_id: selectedPageId as WCGNodeId,
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

  const handleDeleteBlock = () => {
    if (!selectedNode) return;
    const builder = createBuilder('cms');
    applyMutation(builder.deleteNode(selectedNode.id));
    setSelectedNodeId(null);
  };

  const handleDuplicateBlock = () => {
    if (!selectedNode || !selectedPageId) return;
    const builder = createBuilder('cms');
    const result = applyMutation(builder.createNode({
      type: selectedNode.type as any,
      name: `${selectedNode.name}-copy-${Date.now().toString(36)}`,
      display_name: `${selectedNode.display_name ?? selectedNode.name} (copy)`,
      parent_id: selectedPageId as WCGNodeId,
      props: { ...selectedNode.props },
    }));
    if (result.status === 'applied' && result.affected_nodes[0]) setSelectedNodeId(result.affected_nodes[0]);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!selectedPageId) return;
    const children = Object.values(snapshot.nodes).filter(n => n.parent_id === selectedPageId);
    const idx = children.findIndex(n => n.id === blockId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= children.length) return;
    const builder = createBuilder('cms');
    applyMutation(builder.updateProps(blockId as WCGNodeId, {
      ...(snapshot.nodes as Record<string, typeof snapshot.nodes[WCGNodeId]>)[blockId]?.props,
      _order: targetIdx,
    }));
    applyMutation(builder.updateProps(children[targetIdx].id, {
      ...children[targetIdx]?.props,
      _order: idx,
    }));
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
        if (e.key === 'd' && selectedNode) { e.preventDefault(); handleDuplicateBlock(); }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault(); handleDeleteBlock();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

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
              <div className="ml-auto flex items-center gap-1">
                <button onClick={() => handleMoveBlock(selectedNode.id, 'up')} className="rounded p-1 text-muted-foreground/50 hover:bg-muted hover:text-foreground" title="Move up">▲</button>
                <button onClick={() => handleMoveBlock(selectedNode.id, 'down')} className="rounded p-1 text-muted-foreground/50 hover:bg-muted hover:text-foreground" title="Move down">▼</button>
                <button onClick={handleDuplicateBlock} className="rounded p-1 text-muted-foreground/50 hover:bg-muted hover:text-cyan-400" title="Duplicate (Cmd+D)">⧉</button>
                <button onClick={handleDeleteBlock} className="rounded p-1 text-muted-foreground/50 hover:bg-muted hover:text-red-400" title="Delete (Del)">✕</button>
                <span className="text-[10px] text-muted-foreground/30 ml-1">v{selectedNode.version}</span>
              </div>
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
  const [pipelineData, setPipelineData] = React.useState<{
    pipeline: Array<{ stage: string; count: number; quotes: Array<{ id: string; name: string; services: string; estimatedValue: number | null; leadPriority: string | null }> }>;
    meta: { total_quotes: number; total_value: number };
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/crm?view=pipeline')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.pipeline) setPipelineData(data); })
      .catch(() => {});
  }, []);

  // Map CRM stages to SPBVG phases for the visual pipeline
  const spbvgPhases = [
    { id: 'scout', label: 'Scout', color: '#8b5cf6', desc: 'New leads discovered', stages: ['pending'] },
    { id: 'plan', label: 'Plan', color: '#3b82f6', desc: 'Contacted & qualifying', stages: ['contacted'] },
    { id: 'build', label: 'Build', color: '#f97316', desc: 'Quotes sent & negotiating', stages: ['quoted', 'negotiating'] },
    { id: 'validate', label: 'Validate', color: '#22c55e', desc: 'Invoiced & payment pending', stages: ['invoiced'] },
    { id: 'govern', label: 'Govern', color: '#06b6d4', desc: 'Paid & completed', stages: ['paid'] },
  ];

  const totalQuotes = pipelineData?.meta.total_quotes ?? 0;
  const totalValue = pipelineData?.meta.total_value ?? 0;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Pipeline — SPBVG Mapping</h2>
          <p className="text-[10px] text-muted-foreground/50">CRM stages mapped to Scout → Plan → Build → Validate → Govern</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{totalQuotes} leads</span>
          <span>${totalValue.toLocaleString()} pipeline</span>
        </div>
      </div>

      {/* SPBVG Phase Board */}
      <div className="flex gap-3 mb-6">
        {spbvgPhases.map((phase) => {
          const stageData = pipelineData?.pipeline.filter(p => phase.stages.includes(p.stage)) ?? [];
          const count = stageData.reduce((s, d) => s + d.count, 0);
          const quotes = stageData.flatMap(d => d.quotes);
          const pct = totalQuotes > 0 ? (count / totalQuotes) * 100 : 0;

          return (
            <div key={phase.id} className="flex-1 min-w-0">
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: phase.color }} />
                <span className="text-xs font-semibold">{phase.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{count}</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted mb-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: phase.color }} />
              </div>

              {/* Phase description */}
              <p className="text-[10px] text-muted-foreground/60 mb-2">{phase.desc}</p>

              {/* Quote cards in phase */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {quotes.slice(0, 5).map((q) => (
                  <div key={q.id} className="rounded border border-border/50 p-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{q.name}</span>
                      {q.leadPriority && (
                        <span className={`rounded-full px-1 py-0.5 text-[8px] font-medium ${
                          q.leadPriority === 'hot' ? 'bg-red-500/15 text-red-400' :
                          q.leadPriority === 'warm' ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-muted text-muted-foreground'
                        }`}>{q.leadPriority}</span>
                      )}
                    </div>
                    <div className="text-muted-foreground/50 truncate">{q.services?.split(',')[0]}</div>
                    {q.estimatedValue != null && <div className="font-medium mt-0.5" style={{ color: phase.color }}>${q.estimatedValue.toFixed(0)}</div>}
                  </div>
                ))}
                {quotes.length > 5 && (
                  <div className="text-[10px] text-muted-foreground/40 text-center">+{quotes.length - 5} more</div>
                )}
                {quotes.length === 0 && (
                  <div className="text-[10px] text-muted-foreground/30 text-center py-3">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lost deals sidebar */}
      {pipelineData?.pipeline.find(p => p.stage === 'lost')?.count ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-red-400">Lost ({pipelineData.pipeline.find(p => p.stage === 'lost')?.count})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pipelineData.pipeline.find(p => p.stage === 'lost')?.quotes.slice(0, 6).map(q => (
              <span key={q.id} className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">{q.name}</span>
            ))}
          </div>
        </div>
      ) : null}

      {!pipelineData && (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading pipeline data...</div>
      )}
    </div>
  );
}

function WorkflowsView() {
  const { snapshot } = useStudio();
  const pages = Object.values(snapshot.nodes).filter(n => n.type === 'page');
  const components = Object.values(snapshot.nodes).filter(n => n.type === 'component');
  const dataSources = Object.values(snapshot.nodes).filter(n => n.type === 'data_source');
  const layouts = Object.values(snapshot.nodes).filter(n => n.type === 'layout');

  // Build dependency edges from WCG parent-child relationships
  const edges: Array<{ from: string; to: string; type: string }> = [];
  for (const node of Object.values(snapshot.nodes)) {
    if (node.parent_id) {
      edges.push({ from: node.parent_id, to: node.id, type: 'contains' });
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Dependency Graph</h2>
          <p className="text-[10px] text-muted-foreground/50">WCG node relationships — {Object.keys(snapshot.nodes).length} nodes, {edges.length} edges</p>
        </div>
      </div>

      {/* Node type columns */}
      <div className="flex gap-4 mb-6">
        {[
          { label: 'Data Sources', nodes: dataSources, color: '#22c55e', icon: '🗄️' },
          { label: 'Layouts', nodes: layouts, color: '#8b5cf6', icon: '📐' },
          { label: 'Pages', nodes: pages, color: '#3b82f6', icon: '📄' },
          { label: 'Components', nodes: components, color: '#f97316', icon: '🧩' },
        ].map(group => (
          <div key={group.label} className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span>{group.icon}</span>
              <span className="text-xs font-semibold">{group.label}</span>
              <span className="text-[10px] text-muted-foreground">{group.nodes.length}</span>
            </div>
            <div className="space-y-1.5">
              {group.nodes.map(node => {
                const children = Object.values(snapshot.nodes).filter(n => n.parent_id === node.id);
                return (
                  <div key={node.id} className="rounded border border-border/50 p-2 text-[11px]" style={{ borderLeftColor: group.color, borderLeftWidth: 3 }}>
                    <div className="font-medium">{node.display_name ?? node.name}</div>
                    {children.length > 0 && (
                      <div className="text-[9px] text-muted-foreground/50 mt-0.5">→ {children.length} children</div>
                    )}
                    <div className="text-[9px] text-muted-foreground/30">v{node.version}</div>
                  </div>
                );
              })}
              {group.nodes.length === 0 && (
                <div className="text-[10px] text-muted-foreground/30 text-center py-2">None</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edge list */}
      <div className="rounded border border-border/50 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Relationships ({edges.length})</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {edges.map((edge, i) => {
            const fromNode = (snapshot.nodes as Record<string, { display_name?: string; name: string }>)[edge.from];
            const toNode = (snapshot.nodes as Record<string, { display_name?: string; name: string }>)[edge.to];
            return (
              <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span className="font-medium">{fromNode?.display_name ?? fromNode?.name ?? edge.from}</span>
                <span className="text-muted-foreground/30">→</span>
                <span>{toNode?.display_name ?? toNode?.name ?? edge.to}</span>
                <span className="text-[8px] text-muted-foreground/30 ml-auto">{edge.type}</span>
              </div>
            );
          })}
          {edges.length === 0 && <div className="text-[10px] text-muted-foreground/30">No relationships — add blocks to pages to create edges</div>}
        </div>
      </div>
    </div>
  );
}

function AutomationsView() {
  const { snapshot } = useStudio();
  const allNodes = Object.values(snapshot.nodes);
  const integrations = allNodes.filter(n => n.props?.integration_id);

  // Derive automation rules from CRM config
  const automationRules = [
    { trigger: 'New Lead', action: 'Send welcome email', status: 'active', source: 'crmConfig.pipelineStages[new].autoActions' },
    { trigger: 'Quote Sent', action: 'Schedule follow-up', status: 'active', source: 'crmConfig.pipelineStages[quoted].autoActions' },
    { trigger: 'Deal Won', action: 'Create invoice + Schedule job', status: 'active', source: 'crmConfig.pipelineStages[won].autoActions' },
    { trigger: 'Hot Lead Idle', action: 'Follow up within 1 day', status: 'active', source: 'crmConfig.autoFollowUpDays.hot' },
    { trigger: 'Warm Lead Idle', action: 'Follow up within 2 days', status: 'active', source: 'crmConfig.autoFollowUpDays.warm' },
    { trigger: 'Knowledge Feed', action: 'Generate article on schedule', status: 'active', source: 'rotatingTopics.enabled' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Automations</h2>
          <p className="text-[10px] text-muted-foreground/50">{automationRules.length} active rules · {integrations.length} WorkGun integrations</p>
        </div>
      </div>

      {/* Active automation rules */}
      <div className="space-y-2 mb-6">
        {automationRules.map((rule, i) => (
          <div key={i} className="rounded border border-border/50 p-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="text-xs">
                <span className="font-medium text-amber-400">When: </span>
                <span className="text-foreground/80">{rule.trigger}</span>
                <span className="text-muted-foreground/50"> → </span>
                <span className="font-medium text-cyan-400">Then: </span>
                <span className="text-foreground/80">{rule.action}</span>
              </div>
              <div className="text-[9px] text-muted-foreground/30 mt-0.5 font-mono">{rule.source}</div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">{rule.status}</span>
          </div>
        ))}
      </div>

      {/* WorkGun integrations from WCG */}
      {integrations.length > 0 && (
        <>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/70 mb-2">WorkGun Integrations in WCG</div>
          <div className="grid grid-cols-2 gap-2">
            {integrations.map(node => (
              <div key={node.id} className="rounded border border-cyan-500/20 p-2 text-[11px]">
                <div className="font-medium text-cyan-400">{node.display_name ?? node.name}</div>
                <div className="text-[9px] text-muted-foreground/50 font-mono">{String(node.props?.integration_id)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
