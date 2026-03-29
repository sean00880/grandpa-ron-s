import { AppSidebar } from "@/components/app-sidebar"
import { LayoutSocket } from "@/components/layout-socket"
import { cookies } from "next/headers"

/**
 * Services Layout — Uses centralized LayoutSocket.
 */

const SERVICE_TABS = [
  { id: 'all', label: 'All Services', href: '/services' },
  { id: 'mowing', label: 'Mowing', href: '/services/lawn-mowing' },
  { id: 'landscaping', label: 'Landscaping', href: '/services/landscaping' },
  { id: 'tree', label: 'Tree Trimming', href: '/services/tree-trimming' },
  { id: 'seasonal', label: 'Seasonal', href: '/services/leaf-removal' },
]

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <LayoutSocket
      surfaceTitle="Services"
      surfaceTabs={SERVICE_TABS}
      sidebar={<AppSidebar />}
      defaultOpen={defaultOpen}
    >
      {children}
    </LayoutSocket>
  )
}
