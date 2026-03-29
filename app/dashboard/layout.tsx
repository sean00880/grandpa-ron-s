import { AppSidebar } from "@/components/app-sidebar"
import { LayoutSocket } from "@/components/layout-socket"
import { cookies } from "next/headers"

/**
 * Dashboard Layout — Uses centralized LayoutSocket.
 *
 * Surface tabs: Overview, Studio, Insights, CRM, Operations, Marketing, Network, Commerce
 * These appear sticky in the main header when sidebar is collapsed.
 * When sidebar is expanded, they move into the sidebar (handled by AppSidebar).
 *
 * Sub-surface tabs: Used by child routes (e.g., Studio has Core/CMS/Pipelines).
 * These are always visible on desktop and become mobile bottom nav.
 */

const SURFACE_TABS = [
  { id: 'overview', label: 'Overview', href: '/dashboard' },
  { id: 'studio', label: 'Studio', href: '/dashboard/studio' },
  { id: 'insights', label: 'Insights', href: '/dashboard/insights' },
  { id: 'crm', label: 'CRM', href: '/dashboard/crm' },
  { id: 'operations', label: 'Operations', href: '/dashboard/operations' },
  { id: 'marketing', label: 'Marketing', href: '/dashboard/marketing' },
  { id: 'network', label: 'Network', href: '/dashboard/network' },
  { id: 'commerce', label: 'Commerce', href: '/dashboard/commerce' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <LayoutSocket
      surfaceTitle="Mission Control"
      surfaceTabs={SURFACE_TABS}
      sidebar={<AppSidebar />}
      defaultOpen={defaultOpen}
    >
      {children}
    </LayoutSocket>
  )
}
