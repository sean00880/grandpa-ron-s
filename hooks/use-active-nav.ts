"use client"

import { usePathname } from "next/navigation"
import { useCallback } from "react"

/**
 * Custom hook for determining active navigation state
 *
 * @returns Object with helper functions for navigation state
 *
 * @example
 * const { isActive, isActiveGroup } = useActiveNav()
 *
 * // Exact match
 * isActive('/dashboard') // true if pathname === '/dashboard'
 *
 * // Prefix match for group items
 * isActiveGroup('/dashboard') // true if pathname starts with '/dashboard'
 */
export function useActiveNav() {
  const pathname = usePathname()

  /**
   * Check if a specific route is active (exact match)
   *
   * @param href - The route to check
   * @returns true if the current pathname matches exactly
   */
  const isActive = useCallback(
    (href: string): boolean => {
      if (!pathname) return false

      // Exact match
      if (pathname === href) return true

      // Handle index routes - if href is '/' and we're on home
      if (href === '/' && pathname === '/') return true

      return false
    },
    [pathname]
  )

  /**
   * Check if a navigation group should be considered active
   * Used for parent menu items that have children
   *
   * @param baseHref - The base route of the group (e.g., '/dashboard')
   * @returns true if current pathname starts with the baseHref
   */
  const isActiveGroup = useCallback(
    (baseHref: string): boolean => {
      if (!pathname) return false

      // Home route special case
      if (baseHref === '/') {
        return pathname === '/'
      }

      // Check if current path starts with the base href
      // This keeps parent items highlighted when on child routes
      return pathname.startsWith(baseHref)
    },
    [pathname]
  )

  /**
   * Check if any child route is active
   * Useful for determining if a parent menu item should be expanded
   *
   * @param items - Array of child navigation items
   * @returns true if any child is active
   */
  const hasActiveChild = useCallback(
    (items?: Array<{ url: string }>): boolean => {
      if (!items || !pathname) return false

      return items.some((item) =>
        pathname === item.url || pathname.startsWith(item.url + '/')
      )
    },
    [pathname]
  )

  /**
   * Get the current pathname
   * Exposed for custom matching logic
   */
  const currentPath = pathname

  return {
    isActive,
    isActiveGroup,
    hasActiveChild,
    currentPath,
  }
}
