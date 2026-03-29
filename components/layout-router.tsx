'use client';

/**
 * LayoutRouter — Route-aware layout switching.
 *
 * Routes with sidebar layouts (blog, services, dashboard) do NOT show
 * the global Header/Footer — those routes use LayoutSocket instead.
 *
 * Public routes (/, /about, /contact, /quote, /portal, /locations/*)
 * show the full global Header + Footer.
 */

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { ReactNode } from 'react';

// Routes that use LayoutSocket (sidebar-based) — no global header/footer
const SIDEBAR_ROUTES = ['/dashboard', '/blog', '/services'];

export function LayoutRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const usesSidebarLayout = SIDEBAR_ROUTES.some(route => pathname.startsWith(route));

  if (usesSidebarLayout) {
    // Sidebar layouts handle their own chrome via LayoutSocket
    return <>{children}</>;
  }

  // Public routes: global Header + Footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
