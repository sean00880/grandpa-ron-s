'use client';

/**
 * Studio Layout — Dedicated ArcOrc-native surface.
 *
 * LAW-STUDIO-LAYOUT-001: Studio owns its own layout authority.
 * Does NOT reuse dashboard's ShadCN sidebar layout.
 *
 * This layout provides:
 * - WCGStore (canonical state — LAW-WCG-002)
 * - Studio top bar (mode selector + Core/CMS/Pipelines/Workflows/Automations)
 * - Workspace sidebar frame (Files / Chat / Tasks)
 * - Rendering environment frame (Code / Preview)
 * - Execution dock frame (bottom terminal kanbans)
 *
 * All three interfaces (AI Core, CMSOS, Dev) render within this layout
 * as stateless interaction layers over one canonical WCG Core.
 */

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { useSurfaceTab } from '@growsz/arcorc-layout';
import {
  WCGStore,
  MutationBuilder,
  HyperListStore,
  DualLaneExecutor,
  type WCGSnapshot,
  type WCGMutation,
  type WCGMutationResult,
  type InterfaceOrigin,
} from '@growsz/wcg-core';
import {
  StudioContext,
  type StudioContextValue,
  type StudioMode,
  type ProjectView,
  type SidebarTab,
  type RenderTab,
} from './studio-context';

// NOTE: Do NOT add named exports here. Next.js App Router layout files
// must only export: default, metadata, viewport, generateMetadata,
// generateViewport, runtime, revalidate, dynamic, fetchCache, dynamicParams.
// Import useStudio and types from './studio-context' instead.

// ---------------------------------------------------------------------------
// Canonical Core — Singleton (LAW-WCG-002: only core owns state)
// ---------------------------------------------------------------------------

const wcgStore = new WCGStore('grandpa-ron');
const hyperList = new HyperListStore('grandpa-ron');
const dualLane = new DualLaneExecutor({ enabled: true }, hyperList);

// Seed with workspace structure
const sys = new MutationBuilder('system', { scope_id: 'grandpa-ron' });
[
  { type: 'page' as const, name: 'home', display_name: 'Home', props: { path: '/' } },
  { type: 'page' as const, name: 'services', display_name: 'Services', props: { path: '/services' } },
  { type: 'page' as const, name: 'blog', display_name: 'Blog', props: { path: '/blog' } },
  { type: 'page' as const, name: 'quote', display_name: 'Get a Quote', props: { path: '/quote' } },
  { type: 'page' as const, name: 'portal', display_name: 'Customer Portal', props: { path: '/portal' } },
  { type: 'component' as const, name: 'hero', display_name: 'Hero', props: { import_path: '@/components/Hero' } },
  { type: 'component' as const, name: 'quote-form', display_name: 'Quote Form', props: { import_path: '@/components/QuoteRequestForm' } },
  { type: 'component' as const, name: 'gallery', display_name: 'Gallery', props: { import_path: '@/components/Gallery' } },
  { type: 'component' as const, name: 'reviews', display_name: 'Reviews Widget', props: { import_path: '@/components/GoogleReviewsWidget' } },
  { type: 'layout' as const, name: 'public', display_name: 'Public Layout', props: { template: 'header-main-footer' } },
  { type: 'layout' as const, name: 'dashboard', display_name: 'Dashboard Layout', props: { template: 'sidebar-main' } },
  { type: 'data_source' as const, name: 'orcbase', display_name: 'Orcbase (Dbity→Prisma)', props: { source_type: 'database' } },
  { type: 'data_source' as const, name: 'stripe', display_name: 'Stripe Payments', props: { source_type: 'api' } },
  { type: 'data_source' as const, name: 'gemini', display_name: 'Gemini AI', props: { source_type: 'api' } },
].forEach(n => wcgStore.applyMutation(sys.createNode(n)));

// Wire shadow lane
wcgStore.subscribe((e) => {
  if (e.type === 'mutation_applied' || e.type === 'mutation_rejected')
    dualLane.recordMutation(e.mutation, e.result);
});

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const MAX_UNDO_HISTORY = 50;

export default function StudioLayout({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StudioMode>('dev');
  const [projectView, setProjectView] = useSurfaceTab('core', ['core', 'cms', 'pipelines', 'workflows', 'automations'] as const);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('chat');
  const [renderTab, setRenderTab] = useState<RenderTab>('code');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [snapshot, setSnapshot] = useState<WCGSnapshot>(wcgStore.exportSnapshot());
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Undo/redo: track mutation history as snapshots
  const [undoStack, setUndoStack] = useState<WCGSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<WCGSnapshot[]>([]);

  const refreshSnapshot = useCallback(() => setSnapshot(wcgStore.exportSnapshot()), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

  const applyMutation = useCallback((mutation: WCGMutation) => {
    // Save current state to undo stack before applying
    const currentSnap = wcgStore.exportSnapshot();
    setUndoStack(prev => [...prev.slice(-(MAX_UNDO_HISTORY - 1)), currentSnap]);
    setRedoStack([]); // Clear redo on new mutation

    const result = wcgStore.applyMutation(mutation);
    refreshSnapshot();
    return result;
  }, [refreshSnapshot]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prevSnap = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, wcgStore.exportSnapshot()]);
    setUndoStack(prev => prev.slice(0, -1));
    wcgStore.loadSnapshot(prevSnap);
    refreshSnapshot();
  }, [undoStack, refreshSnapshot]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextSnap = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, wcgStore.exportSnapshot()]);
    setRedoStack(prev => prev.slice(0, -1));
    wcgStore.loadSnapshot(nextSnap);
    refreshSnapshot();
  }, [redoStack, refreshSnapshot]);

  const createBuilder = useCallback((origin: InterfaceOrigin) =>
    new MutationBuilder(origin, { scope_id: 'grandpa-ron' }), []);

  const value = useMemo<StudioContextValue>(() => ({
    mode, setMode, projectView, setProjectView,
    sidebarTab, setSidebarTab, renderTab, setRenderTab,
    sidebarCollapsed, toggleSidebar,
    selectedPageId, setSelectedPageId,
    wcg: wcgStore, snapshot, refreshSnapshot,
    hyperList, dualLane,
    applyMutation, createBuilder,
    undo, redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  }), [mode, projectView, sidebarTab, renderTab, sidebarCollapsed, snapshot,
       selectedPageId, undoStack.length, redoStack.length,
       toggleSidebar, refreshSnapshot, applyMutation, createBuilder, undo, redo]);

  return (
    <StudioContext value={value}>
      {children}
    </StudioContext>
  );
}
