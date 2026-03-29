'use client';

/**
 * Studio Context — Shared state for all Studio components.
 *
 * Extracted from layout.tsx so that layout.tsx can remain a valid
 * Next.js App Router layout (which must only export `default`, `metadata`, etc.).
 * Importing from layout.tsx would cause TS2344 because any named export
 * from a layout file that isn't a Next.js-recognized export name is forbidden.
 */

import { createContext, useContext } from 'react';
import type {
  WCGStore,
  WCGSnapshot,
  WCGMutation,
  WCGMutationResult,
  InterfaceOrigin,
} from '@growsz/wcg-core';
import type { HyperListStore, DualLaneExecutor, MutationBuilder } from '@growsz/wcg-core';

export type StudioMode = 'regular' | 'dev';
export type ProjectView = 'core' | 'cms' | 'pipelines' | 'workflows' | 'automations';
export type SidebarTab = 'files' | 'chat' | 'tasks';
export type RenderTab = 'code' | 'preview';

export interface StudioContextValue {
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

  // CMS state
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;

  // Canonical core (read-only access)
  wcg: WCGStore;
  snapshot: WCGSnapshot;
  refreshSnapshot: () => void;
  hyperList: HyperListStore;
  dualLane: DualLaneExecutor;

  // Mutation API (the ONLY way to change state)
  applyMutation: (mutation: WCGMutation) => WCGMutationResult;
  createBuilder: (origin: InterfaceOrigin) => MutationBuilder;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioLayout');
  return ctx;
}
