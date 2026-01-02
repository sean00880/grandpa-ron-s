# Navigation Hooks

> **Last Updated**: 2026-01-01
> **Version**: 1.0.0

This directory contains custom React hooks for navigation functionality.

---

## useBreadcrumbs

A custom React hook for generating dynamic breadcrumbs based on the current route.

### Features

- Automatically generates breadcrumb trail from URL path
- Intelligent formatting for locations, services, and blog posts
- SEO schema support (JSON-LD BreadcrumbList)
- Memoized for performance

### Usage

```typescript
import { useBreadcrumbs, useBreadcrumbSchema } from '@/hooks/use-breadcrumbs'

function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs()
  // Returns: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, ...]

  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href}>
            <a href={crumb.href}>{crumb.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// For SEO - add to page head
function SeoHead() {
  const schema = useBreadcrumbSchema()
  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )
}
```

### API

#### `useBreadcrumbs(): BreadcrumbItem[]`

Returns an array of breadcrumb items for the current route.

```typescript
interface BreadcrumbItem {
  label: string  // Human-readable label
  href: string   // URL path
}
```

#### `useBreadcrumbsWithoutCurrent(): BreadcrumbItem[]`

Same as `useBreadcrumbs()` but excludes the current (last) breadcrumb. Useful when you don't want the current page to be a link.

#### `useBreadcrumbSchema(): object`

Returns a schema.org BreadcrumbList object for SEO.

### Formatting

The hook intelligently formats path segments:

| Path | Result |
|------|--------|
| `/locations/louisville-ky` | `Louisville, KY` |
| `/services/lawn-mowing` | `Lawn Mowing` |
| `/blog/spring-tips` | `Spring Tips` |
| `/dashboard` | `Dashboard` |

---

## useActiveNav

A custom React hook for managing active navigation state in Next.js applications.

### Features

- Detects current route using Next.js `usePathname()`
- Provides exact route matching
- Provides prefix matching for navigation groups
- Detects when child routes are active
- Optimized with `useCallback` for performance

### Usage

```typescript
import { useActiveNav } from '@/hooks/use-active-nav'

function MyNavigation() {
  const { isActive, isActiveGroup, hasActiveChild } = useActiveNav()

  return (
    <nav>
      {/* Exact match - highlights only when on /dashboard */}
      <a href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
        Dashboard
      </a>

      {/* Group match - highlights when on any /settings/* route */}
      <a href="/settings" className={isActiveGroup('/settings') ? 'active' : ''}>
        Settings
      </a>

      {/* Check if any children are active */}
      {hasActiveChild([
        { url: '/settings/profile' },
        { url: '/settings/account' }
      ]) && <span>Active child</span>}
    </nav>
  )
}
```

### API

#### `isActive(href: string): boolean`

Checks if the given route matches the current pathname exactly.

```typescript
isActive('/dashboard') // true only when pathname === '/dashboard'
```

#### `isActiveGroup(baseHref: string): boolean`

Checks if the current pathname starts with the given base href. Useful for parent menu items.

```typescript
isActiveGroup('/settings') // true when on /settings, /settings/profile, etc.
```

#### `hasActiveChild(items?: Array<{ url: string }>): boolean`

Checks if any child route in the array is currently active.

```typescript
hasActiveChild([
  { url: '/dashboard/analytics' },
  { url: '/dashboard/reports' }
]) // true if on either route
```

#### `currentPath: string | null`

The current pathname from Next.js router. Exposed for custom matching logic.

### Example: NavMain Component

The `components/nav-main.tsx` component demonstrates full integration:

```typescript
import { useActiveNav } from "@/hooks/use-active-nav"

export function NavMain({ items }) {
  const { isActive, isActiveGroup, hasActiveChild } = useActiveNav()

  return (
    <nav>
      {items.map((item) => {
        // Determine if group should be active/open
        const groupIsActive = item.items
          ? hasActiveChild(item.items) || isActiveGroup(item.url)
          : isActive(item.url)

        return (
          <MenuItem key={item.title} isActive={groupIsActive}>
            {item.title}
            {item.items?.map((subItem) => (
              <SubMenuItem
                key={subItem.title}
                isActive={isActive(subItem.url)}
              >
                {subItem.title}
              </SubMenuItem>
            ))}
          </MenuItem>
        )
      })}
    </nav>
  )
}
```

### Benefits

1. **Automatic Highlighting**: Navigation items automatically highlight based on current route
2. **Parent Item State**: Parent menu items stay highlighted when child routes are active
3. **Auto Expansion**: Collapsible menu groups automatically open when containing active route
4. **Type Safe**: Fully typed with TypeScript
5. **Performance**: Uses `useCallback` to prevent unnecessary re-renders
6. **Next.js Integration**: Uses native `usePathname()` hook

### Special Cases

#### Home Route

The hook handles the home route (`/`) specially to avoid false positives:

```typescript
isActiveGroup('/') // Only true when pathname === '/'
isActive('/') // Only true when pathname === '/'
```

#### Nested Routes

The hook automatically handles nested routes:

```typescript
// When pathname is '/settings/profile'
isActiveGroup('/settings') // true
isActive('/settings') // false
isActive('/settings/profile') // true
```
