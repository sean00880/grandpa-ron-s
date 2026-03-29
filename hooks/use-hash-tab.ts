'use client';

/**
 * useHashTab — DEPRECATED. Use useSurfaceTab from @growsz/arcorc-layout instead.
 * This file re-exports useSurfaceTab for backward compatibility.
 * Will be removed in next major version.
 */

import { useSurfaceTab } from '@growsz/arcorc-layout';

export function useHashTab(
  defaultTab: string,
  validTabs: readonly string[],
): [string, (tab: string) => void] {
  return useSurfaceTab(defaultTab, validTabs);
}
