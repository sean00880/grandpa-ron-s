import { AppSidebar } from "@/components/app-sidebar"
import { LayoutSocket } from "@/components/layout-socket"
import { cookies } from "next/headers"

/**
 * Blog Layout — Uses centralized LayoutSocket.
 * Surface: Blog with category links.
 */

const BLOG_TABS = [
  { id: 'all', label: 'All Posts', href: '/blog' },
  { id: 'lawn-care', label: 'Lawn Care', href: '/blog/category/lawn-care-tips' },
  { id: 'seasonal', label: 'Seasonal', href: '/blog/category/seasonal-guides' },
  { id: 'diy', label: 'DIY', href: '/blog/category/diy-projects' },
]

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <LayoutSocket
      surfaceTitle="Blog"
      surfaceTabs={BLOG_TABS}
      sidebar={<AppSidebar />}
      defaultOpen={defaultOpen}
    >
      {children}
    </LayoutSocket>
  )
}
