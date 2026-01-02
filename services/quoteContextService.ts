/**
 * QUOTE CONTEXT SERVICE
 * Unified aggregation of all business context for quotes
 *
 * Integration: All registries via dedicated services
 * Usage: Single entry point for quote enhancement
 *
 * This service orchestrates:
 * - Lead scoring
 * - Seasonal pricing
 * - Promotions
 * - Competitor analysis
 * - Social proof
 */

import {
  calculateLeadScore,
  type LeadScoringInput,
  type EnhancedLeadScore
} from './leadScoringService';

import {
  calculateSeasonalPrice,
  applySeasonalPricing,
  getSeasonMarketingContext,
  type SeasonalPriceResult,
  type QuoteLineItemWithSeasonal
} from './pricingEngineService';

import {
  findApplicablePromotions,
  validatePromoCode,
  calculateTotalDiscount,
  formatPromotionDisplay,
  type PromotionContext,
  type ApplicablePromotion,
  type PromoCodeResult
} from './promotionEngineService';

import {
  getCompetitorAnalysis,
  getPricingRecommendation,
  type CompetitorAnalysis
} from './competitorContextService';

import {
  getQuoteSocialProof,
  type QuoteSocialProof
} from './socialProofService';

// Re-export types for convenience
export type {
  EnhancedLeadScore,
  SeasonalPriceResult,
  QuoteLineItemWithSeasonal,
  ApplicablePromotion,
  PromoCodeResult,
  CompetitorAnalysis,
  QuoteSocialProof
};

/**
 * Complete quote context - everything needed for enhanced quote generation
 */
export interface EnhancedQuoteContext {
  // Lead Intelligence
  leadScore: EnhancedLeadScore;
  priority: 'hot' | 'warm' | 'standard' | 'low';
  recommendedFollowUp: string;

  // Pricing
  seasonalContext: {
    currentSeason: string;
    demandLevel: string;
    pricingAdjustment: number;
    pricingMessage?: string;
  };

  // Promotions
  applicablePromotions: ApplicablePromotion[];
  totalPotentialDiscount: number;

  // Competition
  competitorInsights: {
    pricePosition: 'below' | 'at' | 'above';
    competitiveAdvantages: string[];
    talkingPoints: string[];
  };

  // Social Proof
  socialProof: {
    rating: number;
    reviewCount: number;
    trustSignals: string[];
    relevantTestimonial?: string;
  };

  // Meta
  generatedAt: string;
  contextVersion: string;
}

/**
 * Quote input for context generation
 */
export interface QuoteInput {
  // Required
  locationSlug: string;
  serviceIds: string[];
  source: string;

  // Optional enhancements
  estimatedValue?: number;
  propertySize?: 'small' | 'medium' | 'large' | 'commercial';
  urgency?: 'immediate' | 'within-week' | 'flexible';
  customerType?: 'new' | 'existing';
  promoCode?: string;

  // Engagement tracking
  engagement?: {
    usedAIPlanner?: boolean;
    usedAudit?: boolean;
    multiplePageViews?: boolean;
    returnVisit?: boolean;
  };
}

/**
 * Generate complete enhanced quote context
 * This is the primary entry point for quote enhancement
 */
export function generateQuoteContext(input: QuoteInput): EnhancedQuoteContext {
  const {
    locationSlug,
    serviceIds,
    source,
    estimatedValue = 500,
    propertySize,
    urgency,
    customerType = 'new',
    engagement
  } = input;

  // 1. Calculate Lead Score
  const leadScoreInput: LeadScoringInput = {
    locationSlug,
    serviceIds,
    source,
    quoteValue: estimatedValue,
    propertySize,
    urgency,
    engagement
  };
  const leadScore = calculateLeadScore(leadScoreInput);

  // 2. Get Seasonal Context
  const seasonalContext = getSeasonMarketingContext();
  const primaryServiceSeasonal = serviceIds.length > 0
    ? calculateSeasonalPrice(serviceIds[0], 100) // Use 100 as base for percentage
    : null;

  // 3. Find Applicable Promotions
  const promotionContext: PromotionContext = {
    serviceIds,
    locationSlug,
    customerType,
    orderValue: estimatedValue
  };
  const applicablePromotions = findApplicablePromotions(promotionContext);
  const discountResult = calculateTotalDiscount(applicablePromotions, estimatedValue);

  // 4. Get Competitor Insights
  const competitorAnalysis = getCompetitorAnalysis(locationSlug, serviceIds, estimatedValue);

  // 5. Get Social Proof
  const socialProof = getQuoteSocialProof(locationSlug, serviceIds);

  // 6. Build Context Object
  return {
    leadScore,
    priority: leadScore.priority,
    recommendedFollowUp: leadScore.recommendedAction,

    seasonalContext: {
      currentSeason: seasonalContext.season,
      demandLevel: primaryServiceSeasonal?.demandLevel || 'medium',
      pricingAdjustment: primaryServiceSeasonal?.modifier || 0,
      pricingMessage: primaryServiceSeasonal?.message
    },

    applicablePromotions,
    totalPotentialDiscount: discountResult.totalDiscount,

    competitorInsights: {
      pricePosition: competitorAnalysis.pricePosition,
      competitiveAdvantages: competitorAnalysis.competitiveAdvantages.slice(0, 3),
      talkingPoints: competitorAnalysis.talkingPoints.slice(0, 3)
    },

    socialProof: {
      rating: socialProof.ratingDisplay.stars,
      reviewCount: socialProof.ratingDisplay.count,
      trustSignals: socialProof.trustSignals,
      relevantTestimonial: socialProof.relevantReviews[0]?.text
    },

    generatedAt: new Date().toISOString(),
    contextVersion: '1.0.0'
  };
}

/**
 * Generate AI prompt context for Gemini/GPT quote generation
 */
export function generateAIPromptContext(input: QuoteInput): string {
  const context = generateQuoteContext(input);

  let prompt = `QUOTE CONTEXT INTELLIGENCE:

LEAD PRIORITY: ${context.priority.toUpperCase()} (Score: ${context.leadScore.totalScore}/100)
${context.recommendedFollowUp}

SEASONAL CONTEXT:
- Current Season: ${context.seasonalContext.currentSeason}
- Demand Level: ${context.seasonalContext.demandLevel}
${context.seasonalContext.pricingMessage ? `- Note: ${context.seasonalContext.pricingMessage}` : ''}

PRICING POSITION:
- vs Competition: ${context.competitorInsights.pricePosition} market average
- Key Advantages: ${context.competitorInsights.competitiveAdvantages.join(', ')}

AVAILABLE PROMOTIONS:
`;

  if (context.applicablePromotions.length > 0) {
    context.applicablePromotions.forEach(promo => {
      const display = formatPromotionDisplay(promo.promotion);
      prompt += `- ${display.badge}: ${display.title}\n`;
    });
    prompt += `Total potential savings: $${context.totalPotentialDiscount.toFixed(2)}\n`;
  } else {
    prompt += `- No automatic promotions currently apply\n`;
  }

  prompt += `
SOCIAL PROOF:
- Rating: ${context.socialProof.rating} stars (${context.socialProof.reviewCount} reviews)
- Trust Signals: ${context.socialProof.trustSignals.join(', ')}
`;

  if (context.socialProof.relevantTestimonial) {
    const shortTestimonial = context.socialProof.relevantTestimonial.length > 100
      ? context.socialProof.relevantTestimonial.substring(0, 100) + '...'
      : context.socialProof.relevantTestimonial;
    prompt += `- Recent Review: "${shortTestimonial}"\n`;
  }

  prompt += `
CUSTOMER LIFETIME VALUE ESTIMATE:
- First Year: $${context.leadScore.clvEstimate.firstYearValue}
- 3-Year: $${context.leadScore.clvEstimate.threeYearValue}
- 5-Year: $${context.leadScore.clvEstimate.fiveYearValue}

Use this context to personalize the quote and highlight relevant value propositions.
`;

  return prompt;
}

/**
 * Apply all pricing modifications to quote line items
 */
export function enhanceQuoteLineItems(
  items: Array<{
    serviceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>,
  promotionContext: PromotionContext
): {
  enhancedItems: QuoteLineItemWithSeasonal[];
  subtotal: number;
  discounts: {
    seasonal: number;
    promotional: number;
    total: number;
  };
  appliedPromotions: ApplicablePromotion[];
  finalTotal: number;
} {
  // Apply seasonal pricing
  const seasonalItems = applySeasonalPricing(items);

  // Calculate seasonal subtotal
  const subtotal = seasonalItems.reduce((sum, item) => sum + item.total, 0);

  // Calculate seasonal adjustment (difference from original)
  const originalSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  const seasonalDiff = subtotal - originalSubtotal;

  // Find and apply promotions
  const updatedPromotionContext = {
    ...promotionContext,
    orderValue: subtotal
  };
  const applicablePromotions = findApplicablePromotions(updatedPromotionContext);
  const discountResult = calculateTotalDiscount(applicablePromotions, subtotal);

  const finalTotal = subtotal - discountResult.totalDiscount;

  return {
    enhancedItems: seasonalItems,
    subtotal,
    discounts: {
      seasonal: seasonalDiff < 0 ? Math.abs(seasonalDiff) : 0, // Only count savings
      promotional: discountResult.totalDiscount,
      total: (seasonalDiff < 0 ? Math.abs(seasonalDiff) : 0) + discountResult.totalDiscount
    },
    appliedPromotions: discountResult.appliedPromotions,
    finalTotal: Math.max(0, finalTotal)
  };
}

/**
 * Validate a promo code in the context of a quote
 */
export function validateQuotePromoCode(
  code: string,
  input: QuoteInput
): PromoCodeResult {
  const context: PromotionContext = {
    serviceIds: input.serviceIds,
    locationSlug: input.locationSlug,
    customerType: input.customerType || 'new',
    orderValue: input.estimatedValue || 500
  };

  return validatePromoCode(code, context);
}

/**
 * Get quick context summary for real-time form feedback
 */
export function getQuickContextSummary(
  locationSlug: string,
  serviceIds: string[]
): {
  estimatedScore: number;
  hasPromotions: boolean;
  seasonalNote?: string;
  pricePosition: string;
} {
  // Quick seasonal check
  const seasonal = serviceIds.length > 0
    ? calculateSeasonalPrice(serviceIds[0], 100)
    : null;

  // Quick promotion check
  const promos = findApplicablePromotions({
    serviceIds,
    locationSlug,
    customerType: 'new',
    orderValue: 500
  });

  // Quick competitor check
  const competitor = getCompetitorAnalysis(locationSlug, serviceIds, 500);

  return {
    estimatedScore: 50 + (serviceIds.length * 5), // Rough estimate
    hasPromotions: promos.length > 0,
    seasonalNote: seasonal?.message,
    pricePosition: competitor.pricePosition === 'below'
      ? 'Competitive pricing'
      : competitor.pricePosition === 'above'
        ? 'Premium quality'
        : 'Market rate'
  };
}

/**
 * Export service access for direct use if needed
 */
export {
  calculateLeadScore,
  calculateSeasonalPrice,
  applySeasonalPricing,
  findApplicablePromotions,
  validatePromoCode,
  calculateTotalDiscount,
  formatPromotionDisplay,
  getCompetitorAnalysis,
  getPricingRecommendation,
  getQuoteSocialProof,
  getSeasonMarketingContext
};

export default {
  generateQuoteContext,
  generateAIPromptContext,
  enhanceQuoteLineItems,
  validateQuotePromoCode,
  getQuickContextSummary
};
