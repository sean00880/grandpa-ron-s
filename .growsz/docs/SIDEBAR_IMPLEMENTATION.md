# Sidebar Implementation - Grandpa Ron's Lawncare

> **Last Updated**: 2026-01-01
> **Version**: 2.0.0
> **Status**: Production-Ready with E2E Tests

---

## Overview

This document describes the ShadCN sidebar-07 implementation for Grandpa Ron's Lawncare Next.js project. The sidebar provides a powerful, collapsible navigation system for dashboard, blog, and service pages.

## Architecture

### Layout Structure

```
app/
├── layout.tsx                    # Root layout (Header/Footer for marketing)
├── dashboard/
│   ├── layout.tsx               # Dashboard layout with sidebar
│   └── page.tsx                 # Dashboard content
├── blog/
│   ├── layout.tsx               # Blog layout with sidebar
│   ├── page.tsx                 # Blog listing
│   └── [slug]/page.tsx          # Individual blog posts
└── services/
    ├── layout.tsx               # Services layout with sidebar
    └── page.tsx                 # Services listing (pre-existing)
```

### Component Structure

```
components/
├── app-sidebar.tsx              # Main sidebar component (uses locationSeoRegistry)
├── nav-main.tsx                 # Collapsible navigation menu (uses useActiveNav)
├── nav-projects.tsx             # Quick actions section
├── team-switcher.tsx            # Brand header (simplified)
├── nav-user.tsx                 # User section (not used currently)
└── ui/
    ├── sidebar.tsx              # ShadCN sidebar primitives
    ├── collapsible.tsx          # Collapsible component
    ├── breadcrumb.tsx           # Breadcrumb navigation
    └── ...                      # Other UI components

hooks/
├── use-active-nav.ts           # Active navigation state detection
├── use-breadcrumbs.ts          # Dynamic breadcrumb generation
├── use-mobile.ts               # Mobile detection
└── useInView.ts                # Intersection observer

lib/
├── blog.ts                     # Blog data access layer
├── prisma.ts                   # Prisma singleton client
└── utils.ts                    # Common utilities

e2e/
├── sidebar.spec.ts             # Comprehensive sidebar tests
├── example.spec.ts             # Basic verification tests
├── helpers.ts                  # Reusable test utilities
└── README.md                   # E2E documentation
```

## Strengths

### 1. Icon-Collapsible Mode
- Sidebar collapses to icon-only view for more content space
- Smooth animations via CSS transitions
- Cookie-based state persistence

### 2. Semantic Navigation
- Collapsible menu groups for Services, Blog, Locations, About
- Quick Actions section for Get a Quote and Contact
- Breadcrumb navigation for context

### 3. Type-Safe Implementation
- Full TypeScript support
- Lucide icons with proper typing
- React 19 compatible

### 4. Mobile Responsive
- Sheet-based sidebar on mobile devices
- Touch-friendly menu items
- Adaptive layout with SidebarInset

### 5. Consistent with MEMELinked2
- Same layout socket pattern
- Shared ShadCN component library
- Identical CSS variable system

## Current Gaps

### 1. Authentication Not Integrated
- NavUser component exists but not connected to AuthContext
- No admin vs. public user distinction
- Footer section currently removed

### ~~2. Dynamic Breadcrumbs~~ ✅ COMPLETED
- ~~Breadcrumbs are static per layout~~
- ~~Should dynamically update based on current route~~
- ~~Need to implement usePathname-based breadcrumb generation~~
- **Implemented:** `hooks/use-breadcrumbs.ts` with location/service/blog formatting

### ~~3. Active State Navigation~~ ✅ COMPLETED
- ~~Menu items don't highlight based on current route~~
- ~~Need to implement usePathname for active state detection~~
- ~~isActive prop currently static~~
- **Implemented:** `hooks/use-active-nav.ts` integrated into `nav-main.tsx`

### ~~4. Blog Content System~~ ✅ COMPLETED
- ~~Blog posts are sample data~~
- ~~Need CMS/database integration (Prisma or headless CMS)~~
- ~~Categories are hardcoded~~
- **Implemented:** Prisma models for BlogPost, BlogCategory, BlogTag with data access layer

### ~~5. Locations Integration~~ ✅ COMPLETED
- ~~Location sidebar items hardcoded~~
- ~~Should pull from locationSeoRegistry~~
- ~~Need dynamic location pages~~
- **Implemented:** `app-sidebar.tsx` now pulls top 5 locations sorted by priority

## Roadmap

### Phase 1: Navigation Polish ✅ COMPLETE
- [x] Implement dynamic breadcrumbs using usePathname (`hooks/use-breadcrumbs.ts`)
- [x] Add active state detection to NavMain (`hooks/use-active-nav.ts`)
- [x] Connect useRouter for client-side navigation (Next.js `Link` component)

### Phase 2: Content Integration ✅ COMPLETE
- [x] Create Prisma models for Blog (Post, Category, Tag) (`prisma/schema.prisma`)
- [x] Create blog data access layer (`lib/blog.ts`)
- [x] Blog content stored as MDX strings in database
- [x] Connect locationSeoRegistry to Locations menu (`app-sidebar.tsx`)

### Phase 3: Authentication (Priority: Medium) - Pending
- [ ] Connect AuthContext to NavUser
- [ ] Create admin-specific sidebar variant
- [ ] Add role-based menu visibility

### Phase 4: Enhanced Features (Priority: Low) - Partial
- [ ] Add search functionality in sidebar
- [x] Implement keyboard navigation (E2E tested, `'b'` key shortcut)
- [ ] Add sidebar resize drag handle
- [ ] Create mobile-optimized quick actions FAB

### Phase 5: Testing ✅ COMPLETE (Added)
- [x] Setup Playwright testing framework
- [x] Desktop sidebar E2E tests (17 tests)
- [x] Mobile sidebar E2E tests
- [x] Accessibility tests (ARIA, keyboard navigation)
- [x] Location registry integration tests

## File Changes Summary

### New Files Created
| File | Description |
|------|-------------|
| `app/dashboard/layout.tsx` | Dashboard sidebar layout |
| `app/dashboard/page.tsx` | Dashboard content with stats |
| `app/blog/layout.tsx` | Blog sidebar layout |
| `app/blog/page.tsx` | Blog listing with cards |
| `app/blog/[slug]/page.tsx` | Blog post template |
| `app/services/layout.tsx` | Services sidebar layout |
| `hooks/use-breadcrumbs.ts` | Dynamic breadcrumb generation with location/service formatting |
| `hooks/use-active-nav.ts` | Active navigation state detection |
| `lib/blog.ts` | Blog data access layer with Prisma queries |
| `lib/prisma.ts` | Prisma singleton for Next.js |
| `prisma/seed.ts` | Database seed script with sample data |
| `playwright.config.ts` | Playwright E2E testing configuration |
| `e2e/sidebar.spec.ts` | Comprehensive sidebar E2E tests |
| `e2e/example.spec.ts` | Basic verification tests |
| `e2e/helpers.ts` | Reusable test utilities |

### Modified Files
| File | Changes |
|------|---------|
| `components/app-sidebar.tsx` | Added locationSeoRegistry integration, dynamic location items |
| `components/nav-main.tsx` | Integrated useActiveNav hook, Next.js Link navigation |
| `components/nav-projects.tsx` | Simplified to "Quick Actions" |
| `components/team-switcher.tsx` | Simplified to brand display only |
| `prisma/schema.prisma` | Added Blog models (BlogPost, BlogCategory, BlogTag) |
| `app/api/quote/route.ts` | Updated for SQLite compatibility |
| `package.json` | Added Playwright scripts (test:e2e, test:e2e:ui, etc.) |

### ShadCN Components Installed
- sidebar-07 (complete sidebar system)
- card
- badge
- breadcrumb
- collapsible
- dropdown-menu
- avatar
- separator
- tooltip

## CSS Variables

The sidebar uses CSS variables defined in `globals.css`:

```css
--sidebar: oklch(0.98 0 0);
--sidebar-foreground: oklch(0.25 0 0);
--sidebar-primary: oklch(0.55 0.18 145);
--sidebar-primary-foreground: oklch(1 0 0);
--sidebar-accent: oklch(0.94 0.03 145);
--sidebar-accent-foreground: oklch(0.25 0.05 145);
--sidebar-border: oklch(0.92 0 0);
--sidebar-ring: oklch(0.55 0.18 145);
```

## Usage Example

```tsx
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header>
          <SidebarTrigger />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## Navigation Hooks

### useBreadcrumbs

Dynamic breadcrumb generation based on current route:

```tsx
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs"

export function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs()
  // Returns: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, ...]

  return (
    <nav>
      {breadcrumbs.map((crumb, index) => (
        <Link key={crumb.href} href={crumb.href}>{crumb.label}</Link>
      ))}
    </nav>
  )
}
```

Features:
- Location formatting: `louisville-ky` → `Louisville, KY`
- Service formatting: `lawn-mowing` → `Lawn Mowing`
- Blog post title formatting
- SEO schema support via `useBreadcrumbSchema()`

### useActiveNav

Active navigation state detection:

```tsx
import { useActiveNav } from "@/hooks/use-active-nav"

function NavItem({ href, children }) {
  const { isActive, isActiveGroup, hasActiveChild } = useActiveNav()

  const active = isActive(href) // Exact match
  const groupActive = isActiveGroup(href) // Prefix match

  return <Link href={href} data-active={active}>{children}</Link>
}
```

## Blog Data Access Layer

The `lib/blog.ts` provides typed Prisma queries:

```typescript
import { getAllPosts, getPostBySlug, getPostsByCategory } from "@/lib/blog"

// Get published posts
const posts = await getAllPosts({ status: 'published', limit: 10 })

// Get single post
const post = await getPostBySlug('spring-lawn-guide')

// Get by category
const tips = await getPostsByCategory('lawn-care-tips')

// Search posts
const results = await searchPosts('fertilizer')
```

## E2E Testing

Comprehensive Playwright test suite:

```bash
# Run all tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

Test coverage:
- Desktop sidebar functionality (17 tests)
- Mobile sidebar (Sheet) behavior
- Navigation and routing
- Active state management
- Location registry integration
- Accessibility (ARIA, keyboard navigation)

See `e2e/README.md` for detailed documentation.

## Related Documentation

- [ShadCN Sidebar Documentation](https://ui.shadcn.com/docs/components/sidebar)
- [Next.js App Router Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [GROWSZ Biosphere CLAUDE.md](../../../CLAUDE.md)
- [Hooks Documentation](../../hooks/README.md)
- [E2E Testing Guide](../../e2e/README.md)

---

*Part of Grandpa Ron's Next.js Ecosystem*
*GROWSZ Biosphere L1 Implementation*
*Last Updated: 2026-01-01 | Version 2.0.0*
