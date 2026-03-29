"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

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

  // Track manual toggle overrides (cleared on route change)
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean | undefined>>({})
  useEffect(() => { setManualOverrides({}) }, [currentPath])

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
                        // Navigate to first sub-item's URL (supports both ?tab= and legacy #)
                        const firstSubUrl = item.items![0]?.url ?? item.url
                        router.push(firstSubUrl)
                        // Open the submenu
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
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <Link
                                  href={subItem.url}
                                  onClick={hasQueryParam ? (e) => {
                                    // For ?tab= URLs on the same base path, use router.push to avoid full reload
                                    const [basePath] = subItem.url.split('?')
                                    if (window.location.pathname === basePath) {
                                      e.preventDefault()
                                      router.push(subItem.url)
                                    }
                                  } : hasHash ? (e) => {
                                    // Legacy hash URLs: set hash directly when on same page
                                    const [basePath, hash] = subItem.url.split('#')
                                    if (window.location.pathname === basePath) {
                                      e.preventDefault()
                                      window.location.hash = hash
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
