'use client';

/**
 * LayoutSocket — Centralized layout primitive for all sidebar-based surfaces.
 *
 * Consolidates blog, services, and dashboard layouts into one reusable shell.
 * Manages the interaction between:
 *   - Global header (top row — hides on scroll in sidebar surfaces)
 *   - Surface header (second row — sticky within main inset)
 *   - Sidebar (left — context-specific links per surface)
 *   - Main content (center — 100vh with internal scroll)
 *   - Footer (single-line, fixed at bottom of main)
 *
 * Architecture:
 *   ArcOrc (frontend suite) → LayoutSocket (layout primitive) → surfaces
 *
 * Mobile:
 *   - Global links hidden (in sidebar instead)
 *   - Surface menu in sidebar above global links
 *   - Sub-surface tabs fixed at bottom (mobile nav)
 */

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SurfaceLink {
  id: string;
  label: string;
  href: string;
}

export interface SubSurfaceLink {
  id: string;
  label: string;
  href: string;
}

export interface LayoutSocketProps {
  /** Surface title shown in the sticky header */
  surfaceTitle: string;
  /** Primary surface navigation tabs (sticky in main when sidebar collapsed) */
  surfaceTabs?: SurfaceLink[];
  /** Sub-surface tabs (always visible on desktop, mobile bottom nav) */
  subSurfaceTabs?: SubSurfaceLink[];
  /** Sidebar content (rendered inside the ShadCN sidebar) */
  sidebar: ReactNode;
  /** Default sidebar open state */
  defaultOpen?: boolean;
  /** Main content */
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LayoutSocket({
  surfaceTitle,
  surfaceTabs,
  subSurfaceTabs,
  sidebar,
  defaultOpen = false,
  children,
}: LayoutSocketProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Sidebar */}
      {sidebar}

      {/* Main Inset */}
      <SidebarInset>
        <LayoutSocketInner
          surfaceTitle={surfaceTitle}
          surfaceTabs={surfaceTabs}
          subSurfaceTabs={subSurfaceTabs}
        >
          {children}
        </LayoutSocketInner>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ---------------------------------------------------------------------------
// Inner (needs sidebar context)
// ---------------------------------------------------------------------------

function LayoutSocketInner({
  surfaceTitle,
  surfaceTabs,
  subSurfaceTabs,
  children,
}: {
  surfaceTitle: string;
  surfaceTabs?: SurfaceLink[];
  subSurfaceTabs?: SubSurfaceLink[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const isSidebarOpen = sidebar.open;

  return (
    <div className="flex flex-col h-screen">
      {/* ═══ Surface Header (sticky at top of main — always visible) ═══ */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm shrink-0">
        {/* Row 1: Surface title + trigger */}
        <div className="flex h-11 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-semibold">{surfaceTitle}</span>
        </div>

        {/* Row 2: Surface tabs (only when sidebar collapsed on desktop) */}
        {surfaceTabs && surfaceTabs.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 px-4 pb-2">
            {surfaceTabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* ═══ Main Content (scrollable, fills remaining space) ═══ */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* ═══ Footer (single-line, fixed at bottom) ═══ */}
      <footer className="hidden md:flex h-8 items-center justify-between border-t bg-background px-4 text-[10px] text-muted-foreground shrink-0">
        <span>&copy; {new Date().getFullYear()} Grandpa Ron&apos;s Lawns &amp; Landscape LLC</span>
        <span>Powered by WebDevOS</span>
      </footer>

      {/* ═══ Mobile Bottom Nav (sub-surface tabs) ═══ */}
      {subSurfaceTabs && subSurfaceTabs.length > 0 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-background/95 backdrop-blur-sm py-2 safe-bottom">
          {subSurfaceTabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
