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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { locationSeoRegistry } from "@/.growsz/registries/locationSeoRegistry"

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

// Grandpa Ron's Lawncare navigation data
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
