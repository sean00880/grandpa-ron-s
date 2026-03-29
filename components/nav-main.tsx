"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useTransition } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useActiveNav } from "@/hooks/use-active-nav"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isActive, isActiveGroup, hasActiveChild, currentPath } = useActiveNav()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Optimistic path — shows instant highlight before route resolves
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null)

  // Track manual toggle overrides (cleared on route change)
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean | undefined>>({})
  useEffect(() => {
    setManualOverrides({})
    setOptimisticPath(null) // Clear optimistic state when route settles
  }, [currentPath])

  // Optimistic navigation — instant visual feedback
  const navigateOptimistic = (href: string) => {
    setOptimisticPath(href)
    startTransition(() => { router.push(href) })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const groupIsActive = hasSubItems
            ? hasActiveChild(item.items!) || isActiveGroup(item.url)
            : isActive(item.url)

          const manualState = manualOverrides[item.title]
          const isOpen = manualState !== undefined ? manualState : groupIsActive

          return (
            <Collapsible
              key={item.title}
              asChild
              open={hasSubItems ? isOpen : undefined}
              onOpenChange={(open) => {
                setManualOverrides(prev => ({ ...prev, [item.title]: open }))
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasSubItems ? (
                  <>
                    {/* Parent with sub-items: label navigates, chevron toggles */}
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={groupIsActive}
                      onClick={() => {
                        const firstSubUrl = item.items![0]?.url ?? item.url
                        navigateOptimistic(firstSubUrl)
                        setManualOverrides(prev => ({ ...prev, [item.title]: true }))
                      }}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="ml-auto p-0.5 rounded hover:bg-sidebar-accent">
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </button>
                      </CollapsibleTrigger>
                    </SidebarMenuButton>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items!.map((subItem) => {
                          const hasQueryParam = subItem.url.includes('?')
                          const hasHash = subItem.url.includes('#')
                          // Deep nesting: if no sibling has exact match but this item is the
                          // parent path prefix, highlight it (e.g., /blog active on /blog/post-slug)
                          const isSubActive = optimisticPath === subItem.url || isActive(subItem.url) || (
                            !hasQueryParam && !hasHash &&
                            currentPath.startsWith(subItem.url + '/') &&
                            !item.items!.some(s => s.url !== subItem.url && currentPath.startsWith(s.url))
                          )
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubActive}
                              >
                                <Link
                                  href={subItem.url}
                                  onClick={(hasQueryParam || hasHash) ? (e) => {
                                    const [basePath] = subItem.url.split(/[?#]/)
                                    if (window.location.pathname === basePath) {
                                      e.preventDefault()
                                      navigateOptimistic(subItem.url)
                                    }
                                  } : undefined}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  /* Items without sub-items: simple link */
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={groupIsActive}
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
