/**
 * GROWSZ REGISTRY INDEX
 * Central export for all business logic registries
 *
 * Purpose: Unified import point for all registry modules
 * Usage: import { conversionRegistry, promotionRegistry, ... } from '@/.growsz/registries'
 *
 * Architecture:
 * - Registries contain ONLY business logic and data
 * - NO user-facing concerns (UI, formatting, i18n)
 * - Singleton pattern for consistent state
 * - Type-safe interfaces for all data structures
 */

// ============================================
// CONVERSION & LEAD MANAGEMENT
// ============================================
export {
  conversionRegistry,
  type LeadScoreWeights,
  type ServiceValueTier,
  type LocationValueTier,
  type ConversionBenchmark,
  type LeadScoreResult
} from './conversionRegistry';

// ============================================
// PROMOTIONS & CAMPAIGNS
// ============================================
export {
  promotionRegistry,
  type Promotion,
  type PromotionType,
  type PromotionStatus
} from './promotionRegistry';

// ============================================
// SEASONALITY & SCHEDULING
// ============================================
export {
  seasonalityRegistry,
  type MonthlyForecast,
  type SeasonalModifier,
  type Season,
  type Month
} from './seasonalityRegistry';

// ============================================
// COMPETITOR INTELLIGENCE
// ============================================
export {
  competitorRegistry,
  type Competitor
} from './competitorRegistry';

// ============================================
// EQUIPMENT & FLEET MANAGEMENT
// ============================================
export {
  equipmentRegistry,
  type Equipment,
  type MaintenanceRecord
} from './equipmentRegistry';

// ============================================
// REVIEWS & REPUTATION
// ============================================
export {
  reviewRegistry,
  type Review,
  type ReviewSummary
} from './reviewRegistry';

// ============================================
// REGISTRY UTILITIES
// ============================================

/**
 * Registry health check - verifies all registries are properly initialized
 */
export function verifyRegistries(): {
  status: 'healthy' | 'degraded' | 'error';
  registries: Record<string, boolean>;
  timestamp: string;
} {
  const registries: Record<string, boolean> = {
    conversion: false,
    promotion: false,
    seasonality: false,
    competitor: false,
    equipment: false,
    review: false
  };

  try {
    // Verify conversion registry
    const { conversionRegistry } = require('./conversionRegistry');
    registries.conversion = conversionRegistry.getAllBenchmarks().length > 0;

    // Verify promotion registry
    const { promotionRegistry } = require('./promotionRegistry');
    registries.promotion = promotionRegistry.getAllPromotions().length > 0;

    // Verify seasonality registry
    const { seasonalityRegistry } = require('./seasonalityRegistry');
    registries.seasonality = seasonalityRegistry.getAllForecasts().length > 0;

    // Verify competitor registry
    const { competitorRegistry } = require('./competitorRegistry');
    registries.competitor = competitorRegistry.getAllCompetitors().length > 0;

    // Verify equipment registry
    const { equipmentRegistry } = require('./equipmentRegistry');
    registries.equipment = equipmentRegistry.getAllEquipment().length > 0;

    // Verify review registry
    const { reviewRegistry } = require('./reviewRegistry');
    registries.review = reviewRegistry.getAllReviews().length > 0;
  } catch (e) {
    // Individual registry failures are tracked in the registries object
  }

  const allHealthy = Object.values(registries).every(v => v);
  const anyHealthy = Object.values(registries).some(v => v);

  return {
    status: allHealthy ? 'healthy' : anyHealthy ? 'degraded' : 'error',
    registries,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get comprehensive business context for a quote
 */
export function getQuoteContext(
  locationSlug: string,
  serviceIds: string[],
  source: string,
  customerType: 'new' | 'existing',
  quoteValue: number
) {
  const { conversionRegistry } = require('./conversionRegistry');
  const { promotionRegistry } = require('./promotionRegistry');
  const { seasonalityRegistry } = require('./seasonalityRegistry');
  const { competitorRegistry } = require('./competitorRegistry');

  const currentMonth = new Date().getMonth() + 1;

  return {
    // Lead scoring
    leadScore: conversionRegistry.calculateLeadScore(
      locationSlug,
      serviceIds,
      source,
      quoteValue
    ),

    // Available promotions
    autoPromotions: promotionRegistry.getAutoApplyPromotions(
      serviceIds,
      locationSlug,
      customerType,
      quoteValue
    ),

    // Seasonal adjustments
    seasonalModifiers: serviceIds.map((serviceId: string) => ({
      serviceId,
      modifier: seasonalityRegistry.getCurrentModifier(serviceId)
    })),

    // Monthly forecast
    forecast: seasonalityRegistry.getMonthlyForecast(currentMonth as 1|2|3|4|5|6|7|8|9|10|11|12),

    // Competition analysis
    competitorAnalysis: serviceIds.map((serviceId: string) =>
      competitorRegistry.analyzeGaps(locationSlug, serviceId)
    ),

    // CLV estimate
    clvEstimate: conversionRegistry.estimateCLV(
      serviceIds,
      locationSlug,
      customerType === 'existing'
    )
  };
}

/**
 * Get marketing recommendations based on current context
 */
export function getMarketingRecommendations(): {
  priorityLocations: string[];
  priorityServices: string[];
  activePromotions: string[];
  upcomingEvents: string[];
  competitorThreats: string[];
} {
  const { conversionRegistry } = require('./conversionRegistry');
  const { promotionRegistry } = require('./promotionRegistry');
  const { seasonalityRegistry } = require('./seasonalityRegistry');
  const { competitorRegistry } = require('./competitorRegistry');

  const currentMonth = new Date().getMonth() + 1;
  const forecast = seasonalityRegistry.getMonthlyForecast(currentMonth as 1|2|3|4|5|6|7|8|9|10|11|12);

  return {
    priorityLocations: conversionRegistry.getHighValueLocations()
      .slice(0, 5)
      .map((l: { slug: string }) => l.slug),

    priorityServices: forecast?.primaryServices || [],

    activePromotions: promotionRegistry.getActivePromotions()
      .filter((p: { displayOnSite: boolean }) => p.displayOnSite)
      .map((p: { name: string }) => p.name),

    upcomingEvents: seasonalityRegistry.getMarketingPriorityServices()
      .filter((m: { suggestedPromotion?: string }) => m.suggestedPromotion)
      .map((m: { suggestedPromotion?: string }) => m.suggestedPromotion!),

    competitorThreats: competitorRegistry.getTopRatedCompetitors(4.5)
      .slice(0, 3)
      .map((c: { name: string }) => c.name)
  };
}
