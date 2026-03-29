"use client"

import * as React from "react"
import {
  BookOpen,
  Home,
  MapPin,
  MessageSquareQuote,
  Phone,
  Scissors,
  Sprout,
  Users,
  LayoutDashboard,
  BarChart3,
  Code2,
  Lightbulb,
  UserCircle,
  Truck,
  Megaphone,
  Network,
  ShoppingCart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { locationSeoRegistry } from "@/.growsz/registries/locationSeoRegistry"
import { usePathname } from "next/navigation"

// Get top priority locations from registry (limit to 5)
const getTopLocations = () => {
  const allLocations = locationSeoRegistry.getAllLocations()

  // Sort by priority (high > medium > low) and then by distance
  const sortedLocations = allLocations
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]

      if (priorityDiff !== 0) return priorityDiff
      return a.distance_miles - b.distance_miles
    })
    .slice(0, 5)

  return sortedLocations.map(location => ({
    title: location.name,
    url: `/locations/${location.slug}`,
  }))
}

// Dashboard surface menu (with submenus per item)
const dashboardSurfaceNav = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    items: [],
  },
  {
    title: "Studio",
    url: "/dashboard/studio",
    icon: Code2,
    items: [
      { title: "AI Core", url: "/dashboard/studio?tab=core" },
      { title: "CMS", url: "/dashboard/studio?tab=cms" },
      { title: "Pipelines", url: "/dashboard/studio?tab=pipelines" },
      { title: "Workflows", url: "/dashboard/studio?tab=workflows" },
      { title: "Automations", url: "/dashboard/studio?tab=automations" },
    ],
  },
  {
    title: "Insights",
    url: "/dashboard/insights",
    icon: Lightbulb,
    items: [
      { title: "Knowledge Feed", url: "/dashboard/insights?tab=feed" },
      { title: "Lead Insights", url: "/dashboard/insights?tab=leads" },
      { title: "Customer Insights", url: "/dashboard/insights?tab=customers" },
    ],
  },
  {
    title: "CRM",
    url: "/dashboard/crm",
    icon: UserCircle,
    items: [
      { title: "Pipeline", url: "/dashboard/crm?tab=pipeline" },
      { title: "Contacts", url: "/dashboard/crm?tab=contacts" },
      { title: "Invoices", url: "/dashboard/crm?tab=invoices" },
    ],
  },
  {
    title: "Operations",
    url: "/dashboard/operations",
    icon: Truck,
    items: [
      { title: "Schedule", url: "/dashboard/operations?tab=schedule" },
      { title: "Dispatch", url: "/dashboard/operations?tab=dispatch" },
    ],
  },
  {
    title: "Marketing",
    url: "/dashboard/marketing",
    icon: Megaphone,
    items: [
      { title: "Campaigns", url: "/dashboard/marketing" },
      { title: "SEO", url: "/dashboard/marketing" },
    ],
  },
  {
    title: "Network",
    url: "/dashboard/network",
    icon: Network,
    items: [
      { title: "Partners", url: "/dashboard/network" },
      { title: "Listings", url: "/dashboard/network" },
    ],
  },
  {
    title: "Commerce",
    url: "/dashboard/commerce",
    icon: ShoppingCart,
    items: [
      { title: "Revenue", url: "/dashboard/commerce" },
      { title: "Stripe", url: "/dashboard/commerce" },
    ],
  },
]

// Grandpa Ron's global navigation data
const data = {
  teams: [
    {
      name: "Grandpa Ron's",
      logo: Sprout,
      plan: "Lawncare LLC",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Recent Quotes",
          url: "/dashboard/quotes",
        },
      ],
    },
    {
      title: "Services",
      url: "/services",
      icon: Scissors,
      items: [
        {
          title: "Lawn Mowing",
          url: "/services/lawn-mowing",
        },
        {
          title: "Landscaping",
          url: "/services/landscaping",
        },
        {
          title: "Leaf Removal",
          url: "/services/leaf-removal",
        },
        {
          title: "Snow Removal",
          url: "/services/snow-removal",
        },
        {
          title: "Garden Design",
          url: "/services/garden-design",
        },
        {
          title: "Tree Trimming",
          url: "/services/tree-trimming",
        },
      ],
    },
    {
      title: "Blog",
      url: "/blog",
      icon: BookOpen,
      items: [
        {
          title: "All Posts",
          url: "/blog",
        },
        {
          title: "Lawn Care Tips",
          url: "/blog/category/lawn-care-tips",
        },
        {
          title: "Seasonal Guides",
          url: "/blog/category/seasonal-guides",
        },
        {
          title: "DIY Projects",
          url: "/blog/category/diy-projects",
        },
      ],
    },
    {
      title: "Locations",
      url: "/locations",
      icon: MapPin,
      items: [
        {
          title: "Service Areas",
          url: "/locations",
        },
        ...getTopLocations(),
        {
          title: "View All Locations",
          url: "/locations",
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      icon: Users,
      items: [
        {
          title: "Our Story",
          url: "/about",
        },
        {
          title: "Team",
          url: "/about/team",
        },
        {
          title: "Reviews",
          url: "/reviews",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Get a Quote",
      url: "/quote",
      icon: MessageSquareQuote,
    },
    {
      name: "Contact Us",
      url: "/contact",
      icon: Phone,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Surface menu (above global nav) — only on dashboard routes */}
        {isDashboard && (
          <>
            <NavMain items={dashboardSurfaceNav} />
            <SidebarSeparator />
          </>
        )}
        {/* Global navigation */}
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
