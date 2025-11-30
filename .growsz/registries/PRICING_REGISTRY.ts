/**
 * PRICING_REGISTRY - Grandpa Ron Lawncare Platform
 *
 * Defines tier entitlements, feature keys, and access control for the lawncare services platform.
 * This is the canonical source for what features are available at each tier.
 *
 * Platform: Trade Services Marketplace (lawn care, tree cutting, mulching, contractors, roofers, solar)
 */

import type { TierId } from '../core/dev-pipelines/types';

// ============================================================================
// Feature Keys
// ============================================================================

/**
 * Feature keys for tier-based access control
 */
export type FeatureKey =
  // Core access
  | 'access:customer'
  | 'access:provider'
  | 'access:premium-provider'
  | 'access:enterprise'

  // Service types
  | 'service:lawn-mowing'
  | 'service:tree-cutting'
  | 'service:mulching'
  | 'service:landscaping'
  | 'service:roofing'
  | 'service:solar'
  | 'service:general-contracting'
  | 'service:custom'

  // Provider features
  | 'provider:basic-listing'
  | 'provider:featured-listing'
  | 'provider:priority-booking'
  | 'provider:analytics'
  | 'provider:customer-reviews'
  | 'provider:before-after-gallery'
  | 'provider:video-portfolio'
  | 'provider:instant-quotes'
  | 'provider:recurring-services'

  // Customer features
  | 'customer:instant-booking'
  | 'customer:price-comparison'
  | 'customer:ai-recommendations'
  | 'customer:service-history'
  | 'customer:loyalty-rewards'
  | 'customer:priority-support'

  // AI features
  | 'ai:quote-assistant'
  | 'ai:property-analysis'
  | 'ai:service-recommendations'
  | 'ai:scheduling-optimization'
  | 'ai:price-estimation'

  // Platform features
  | 'platform:multi-property'
  | 'platform:team-management'
  | 'platform:white-label'
  | 'platform:api-access'
  | 'platform:webhooks';

// ============================================================================
// Tier Definitions
// ============================================================================

/**
 * Tier structure with entitlements
 */
export interface PricingTier {
  id: TierId;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: FeatureKey[];
  limits: {
    servicesPerMonth?: number;
    providersListed?: number;
    propertiesManaged?: number;
    teamMembers?: number;
    apiCallsPerMonth?: number;
  };
}

/**
 * PRICING_REGISTRY
 * Canonical source of truth for tier entitlements
 */
export const PRICING_REGISTRY: Record<TierId, PricingTier> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Basic access for customers to find and book services',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'access:customer',
      'service:lawn-mowing',
      'service:landscaping',
      'customer:price-comparison',
      'customer:service-history',
    ],
    limits: {
      servicesPerMonth: 2,
      propertiesManaged: 1,
    },
  },

  customer: {
    id: 'customer',
    name: 'Customer Plus',
    description: 'Enhanced features for homeowners managing multiple properties',
    monthlyPrice: 9.99,
    annualPrice: 99,
    features: [
      'access:customer',
      'service:lawn-mowing',
      'service:tree-cutting',
      'service:mulching',
      'service:landscaping',
      'service:roofing',
      'service:solar',
      'customer:instant-booking',
      'customer:price-comparison',
      'customer:ai-recommendations',
      'customer:service-history',
      'customer:loyalty-rewards',
      'ai:service-recommendations',
      'ai:price-estimation',
      'platform:multi-property',
    ],
    limits: {
      servicesPerMonth: 10,
      propertiesManaged: 5,
    },
  },

  provider: {
    id: 'provider',
    name: 'Provider Basic',
    description: 'Entry-level tier for service providers',
    monthlyPrice: 29.99,
    annualPrice: 299,
    features: [
      'access:provider',
      'service:lawn-mowing',
      'service:tree-cutting',
      'service:mulching',
      'service:landscaping',
      'provider:basic-listing',
      'provider:customer-reviews',
      'provider:before-after-gallery',
      'provider:instant-quotes',
      'ai:quote-assistant',
      'ai:scheduling-optimization',
    ],
    limits: {
      servicesPerMonth: 50,
      teamMembers: 3,
    },
  },

  'provider-pro': {
    id: 'provider-pro',
    name: 'Provider Pro',
    description: 'Professional tier with advanced features for growing businesses',
    monthlyPrice: 79.99,
    annualPrice: 799,
    features: [
      'access:premium-provider',
      'service:lawn-mowing',
      'service:tree-cutting',
      'service:mulching',
      'service:landscaping',
      'service:roofing',
      'service:solar',
      'service:general-contracting',
      'provider:featured-listing',
      'provider:priority-booking',
      'provider:analytics',
      'provider:customer-reviews',
      'provider:before-after-gallery',
      'provider:video-portfolio',
      'provider:instant-quotes',
      'provider:recurring-services',
      'ai:quote-assistant',
      'ai:property-analysis',
      'ai:scheduling-optimization',
      'ai:price-estimation',
      'platform:team-management',
    ],
    limits: {
      servicesPerMonth: 200,
      teamMembers: 10,
    },
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'White-label solution for large organizations and franchises',
    monthlyPrice: 299.99,
    annualPrice: 2999,
    features: [
      'access:enterprise',
      'service:lawn-mowing',
      'service:tree-cutting',
      'service:mulching',
      'service:landscaping',
      'service:roofing',
      'service:solar',
      'service:general-contracting',
      'service:custom',
      'provider:featured-listing',
      'provider:priority-booking',
      'provider:analytics',
      'provider:customer-reviews',
      'provider:before-after-gallery',
      'provider:video-portfolio',
      'provider:instant-quotes',
      'provider:recurring-services',
      'ai:quote-assistant',
      'ai:property-analysis',
      'ai:service-recommendations',
      'ai:scheduling-optimization',
      'ai:price-estimation',
      'platform:multi-property',
      'platform:team-management',
      'platform:white-label',
      'platform:api-access',
      'platform:webhooks',
    ],
    limits: {
      // Unlimited for enterprise
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a tier has access to a specific feature
 */
export function hasFeature(tierId: TierId, feature: FeatureKey): boolean {
  return PRICING_REGISTRY[tierId].features.includes(feature);
}

/**
 * Get all features for a tier
 */
export function getFeaturesForTier(tierId: TierId): FeatureKey[] {
  return PRICING_REGISTRY[tierId].features;
}

/**
 * Get tier limits
 */
export function getLimitsForTier(tierId: TierId) {
  return PRICING_REGISTRY[tierId].limits;
}

/**
 * Get tier pricing
 */
export function getPricingForTier(tierId: TierId) {
  const tier = PRICING_REGISTRY[tierId];
  return {
    monthly: tier.monthlyPrice,
    annual: tier.annualPrice,
    annualSavings: tier.monthlyPrice * 12 - tier.annualPrice,
  };
}

/**
 * Check if user has exceeded tier limits
 */
export function checkLimits(
  tierId: TierId,
  usage: {
    servicesThisMonth?: number;
    providersListed?: number;
    propertiesManaged?: number;
    teamMembers?: number;
    apiCallsThisMonth?: number;
  }
): { exceeded: boolean; limitType?: string } {
  const limits = PRICING_REGISTRY[tierId].limits;

  if (limits.servicesPerMonth && usage.servicesThisMonth && usage.servicesThisMonth > limits.servicesPerMonth) {
    return { exceeded: true, limitType: 'servicesPerMonth' };
  }

  if (limits.providersListed && usage.providersListed && usage.providersListed > limits.providersListed) {
    return { exceeded: true, limitType: 'providersListed' };
  }

  if (limits.propertiesManaged && usage.propertiesManaged && usage.propertiesManaged > limits.propertiesManaged) {
    return { exceeded: true, limitType: 'propertiesManaged' };
  }

  if (limits.teamMembers && usage.teamMembers && usage.teamMembers > limits.teamMembers) {
    return { exceeded: true, limitType: 'teamMembers' };
  }

  if (limits.apiCallsPerMonth && usage.apiCallsThisMonth && usage.apiCallsThisMonth > limits.apiCallsPerMonth) {
    return { exceeded: true, limitType: 'apiCallsPerMonth' };
  }

  return { exceeded: false };
}
