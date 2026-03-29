/**
 * WorkGun Entitlement System — Runtime feature gating
 *
 * Reads from SSOT: .growsz/registries/product/workgun-entitlements.json
 * Gates surfaces and features based on subscription tier.
 *
 * Product hierarchy enforced:
 *   Ecosystem → WorkGun → WebDevOS → ArcOrc + TryLLM + Backend Trinity
 *
 * Until SIWX auth is deployed, defaults to 'professional' tier (all features).
 * When auth ships, tier resolves from user subscription via SIWX session.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WorkGunTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface TierEntitlements {
  name: string;
  price: number;
  surfaces: Record<string, boolean>;
  features: Record<string, boolean>;
  os_layers: string[];
  limits: Record<string, number>;
}

export interface EntitlementContext {
  tier: WorkGunTier;
  entitlements: TierEntitlements;
  isSurfaceEnabled: (surfaceId: string) => boolean;
  isFeatureEnabled: (featureId: string) => boolean;
  getLimit: (limitId: string) => number;
  getActiveOSLayers: () => string[];
}

// ---------------------------------------------------------------------------
// Registry Loader
// ---------------------------------------------------------------------------

let cachedRegistry: Record<string, TierEntitlements> | null = null;

function loadEntitlementRegistry(): Record<string, TierEntitlements> {
  if (cachedRegistry) return cachedRegistry;

  const registryPath = resolve(process.cwd(), '../../.growsz/registries/product/workgun-entitlements.json');
  if (!existsSync(registryPath)) {
    // Fallback: all features enabled (development mode)
    return {};
  }

  try {
    const raw = JSON.parse(readFileSync(registryPath, 'utf8'));
    const result: Record<string, TierEntitlements> = raw.tiers ?? {};
    cachedRegistry = result;
    return result;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Entitlement Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve entitlements for a given tier.
 *
 * Until SIWX auth is deployed, the tier is determined by:
 * 1. WORKGUN_TIER env variable (for testing)
 * 2. Default: 'professional' (all features enabled for development)
 *
 * When SIWX ships, tier resolves from user subscription in session.
 */
export function resolveEntitlements(overrideTier?: WorkGunTier): EntitlementContext {
  const tier: WorkGunTier = overrideTier
    ?? (process.env.WORKGUN_TIER as WorkGunTier)
    ?? 'professional'; // Default: all features for development

  const registry = loadEntitlementRegistry();
  const entitlements = registry[tier] ?? {
    name: tier,
    price: 0,
    surfaces: {},
    features: {},
    os_layers: ['identityos'],
    limits: {},
  };

  return {
    tier,
    entitlements,
    isSurfaceEnabled: (surfaceId: string) => entitlements.surfaces?.[surfaceId] !== false,
    isFeatureEnabled: (featureId: string) => entitlements.features?.[featureId] !== false,
    getLimit: (limitId: string) => entitlements.limits?.[limitId] ?? -1,
    getActiveOSLayers: () => entitlements.os_layers ?? [],
  };
}

// ---------------------------------------------------------------------------
// Server-Side Helper (for API routes)
// ---------------------------------------------------------------------------

export function checkEntitlement(feature: string, tier?: WorkGunTier): boolean {
  const ctx = resolveEntitlements(tier);
  return ctx.isFeatureEnabled(feature);
}

export function checkSurfaceAccess(surface: string, tier?: WorkGunTier): boolean {
  const ctx = resolveEntitlements(tier);
  return ctx.isSurfaceEnabled(surface);
}
