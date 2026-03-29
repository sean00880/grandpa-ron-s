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

import { useState, useMemo, useCallback, createContext, useContext, type ReactNode } from 'react';
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
// Studio Context — Shared across all Studio components
// ---------------------------------------------------------------------------

export type StudioMode = 'regular' | 'dev';
export type ProjectView = 'core' | 'cms' | 'pipelines' | 'workflows' | 'automations';
export type SidebarTab = 'files' | 'chat' | 'tasks';
export type RenderTab = 'code' | 'preview';

interface StudioContextValue {
  // Mode & navigation
  mode: StudioMode;
  setMode: (m: StudioMode) => void;
  projectView: ProjectView;
  setProjectView: (v: ProjectView) => void;
  sidebarTab: SidebarTab;
  setSidebarTab: (t: SidebarTab) => void;
  renderTab: RenderTab;
  setRenderTab: (t: RenderTab) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Canonical core (read-only access)
  wcg: WCGStore;
  snapshot: WCGSnapshot;
  refreshSnapshot: () => void;
  hyperList: HyperListStore;
  dualLane: DualLaneExecutor;

  // Mutation API (the ONLY way to change state)
  applyMutation: (mutation: WCGMutation) => WCGMutationResult;
  createBuilder: (origin: InterfaceOrigin) => MutationBuilder;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioLayout');
  return ctx;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function StudioLayout({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StudioMode>('dev');
  const [projectView, setProjectView] = useSurfaceTab('core', ['core', 'cms', 'pipelines', 'workflows', 'automations'] as const);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('chat');
  const [renderTab, setRenderTab] = useState<RenderTab>('code');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [snapshot, setSnapshot] = useState<WCGSnapshot>(wcgStore.exportSnapshot());

  const refreshSnapshot = useCallback(() => setSnapshot(wcgStore.exportSnapshot()), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

  const applyMutation = useCallback((mutation: WCGMutation) => {
    const result = wcgStore.applyMutation(mutation);
    refreshSnapshot();
    return result;
  }, [refreshSnapshot]);

  const createBuilder = useCallback((origin: InterfaceOrigin) =>
    new MutationBuilder(origin, { scope_id: 'grandpa-ron' }), []);

  const value = useMemo<StudioContextValue>(() => ({
    mode, setMode, projectView, setProjectView,
    sidebarTab, setSidebarTab, renderTab, setRenderTab,
    sidebarCollapsed, toggleSidebar,
    wcg: wcgStore, snapshot, refreshSnapshot,
    hyperList, dualLane,
    applyMutation, createBuilder,
  }), [mode, projectView, sidebarTab, renderTab, sidebarCollapsed, snapshot,
       toggleSidebar, refreshSnapshot, applyMutation, createBuilder]);

  return (
    <StudioContext value={value}>
      {children}
    </StudioContext>
  );
}
