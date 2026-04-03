/**
 * Vertical API — Returns the resolved vertical config for this workspace.
 *
 * GET /api/vertical — Full vertical registry with tier-resolved surfaces
 * GET /api/vertical?tier=starter — Resolve for a specific tier
 *
 * This is the API that growsz.com's unified surface will call to configure
 * each workspace's Mission Control shell. The response drives:
 * - Surface tab labels and icons
 * - Domain noun mapping (pipeline_noun, resource_type, etc.)
 * - Entitlement gating (which surfaces are accessible)
 * - Feature flags
 */

export const dynamic = 'force-dynamic';

import { vertical } from '@/config/vertical';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tierId = searchParams.get('tier') ?? 'professional';

  const activeTier = vertical.entitlements.tiers.find(t => t.id === tierId)
    ?? vertical.entitlements.tiers.find(t => t.isDefault)
    ?? vertical.entitlements.tiers[0];

  if (!activeTier) {
    return Response.json({ error: 'No tier found' }, { status: 400 });
  }

  const accessibleSurfaceIds = new Set(activeTier.surfaces);

  const resolvedSurfaces: Record<string, {
    label: string;
    icon: string;
    color: string;
    accessible: boolean;
    tabs: Array<{ id: string; label: string; component: string; color?: string }>;
  }> = {};

  for (const [surfaceId, surfaceConfig] of Object.entries(vertical.surfaces)) {
    resolvedSurfaces[surfaceId] = {
      label: surfaceConfig.label,
      icon: surfaceConfig.icon,
      color: surfaceConfig.color,
      accessible: accessibleSurfaceIds.has(surfaceId) || accessibleSurfaceIds.has('*'),
      tabs: surfaceConfig.tabs,
    };
  }

  return Response.json({
    vertical: {
      id: vertical.id,
      brand: vertical.brand,
      package: vertical.package,
    },
    domain: vertical.domain,
    activeTier: {
      id: activeTier.id,
      name: activeTier.name,
      price: activeTier.price,
    },
    surfaces: resolvedSurfaces,
    featureFlags: vertical.featureFlags,
    surfaceCount: Object.keys(resolvedSurfaces).length,
    tabCount: Object.values(resolvedSurfaces).reduce((s, v) => s + v.tabs.length, 0),
    accessibleSurfaces: Object.entries(resolvedSurfaces).filter(([, v]) => v.accessible).length,
  });
}
