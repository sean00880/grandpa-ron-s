"use client"

/**
 * useActiveNav — Now powered by @growsz/arcorc-layout.
 * Supports pathname, hash, AND query param matching.
 */

import { usePathname } from "next/navigation"
import { useActiveNav as useActiveNavBase } from '@growsz/arcorc-layout'

export function useActiveNav() {
  const pathname = usePathname()
  const nav = useActiveNavBase(pathname)
  return { ...nav, currentPath: pathname }
}
