import { AppSidebar } from "@/components/app-sidebar"
import { LayoutSocket } from "@/components/layout-socket"
import { cookies } from "next/headers"
import { vertical } from '@/config/vertical';

/**
 * Dashboard Layout — Reads surface tabs from the VerticalRegistry.
 *
 * The vertical config defines all 8 surfaces and their tabs.
 * This layout reads that config and projects it through LayoutSocket.
 * Zero hardcoded surface definitions — driven entirely by the vertical config.
 *
 * C1/C2 boundary:
 *   - LayoutSocket (from @growsz/arcorc-layout) = WebDevOS shell (L2)
 *   - vertical config = WorkGun field-service vertical (L3)
 *   - AppSidebar = Grandpa Ron's brand/nav (L4)
 */

// Derive surface tabs from the vertical registry
const SURFACE_TABS = Object.entries(vertical.surfaces).map(([id, surface]) => ({
  id,
  label: surface.label,
  href: id === 'overview' ? '/dashboard' : `/dashboard/${id}`,
}));

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <LayoutSocket
      surfaceTitle={`${vertical.brand} Mission Control`}
      surfaceTabs={SURFACE_TABS}
      sidebar={<AppSidebar />}
      defaultOpen={defaultOpen}
    >
      {children}
    </LayoutSocket>
  )
}
