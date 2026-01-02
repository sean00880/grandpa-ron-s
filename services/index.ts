/**
 * SERVICES INDEX
 * Central export for all business logic services
 *
 * Architecture:
 * - Services consume registries (from .growsz/registries)
 * - UI components consume services (NOT registries directly)
 * - Services handle business logic, registries hold data
 */

// ============================================
// QUOTE CONTEXT SERVICE (Primary Entry Point)
// ============================================
export {
  generateQuoteContext,
  generateAIPromptContext,
  enhanceQuoteLineItems,
  validateQuotePromoCode,
  getQuickContextSummary,
  type EnhancedQuoteContext,
  type QuoteInput
} from './quoteContextService';

// ============================================
// LEAD SCORING SERVICE
// ============================================
export {
  calculateLeadScore,
  getQuickScore,
  shouldNotifyImmediately,
  getFollowUpTimeline,
  type LeadScoringInput,
  type EnhancedLeadScore
} from './leadScoringService';

// ============================================
// PRICING ENGINE SERVICE
// ============================================
export {
  calculateSeasonalPrice,
  applySeasonalPricing,
  calculateSeasonalQuoteTotals,
  getSeasonalPricingSummary,
  getSeasonMarketingContext,
  isServiceInPeakDemand,
  getExpectedLeadTime,
  type SeasonalPriceResult,
  type QuoteLineItemWithSeasonal
} from './pricingEngineService';

// ============================================
// PROMOTION ENGINE SERVICE
// ============================================
export {
  findApplicablePromotions,
  validatePromoCode,
  getBannerPromotions,
  getServicePromotions,
  getLocationPromotions,
  getNewCustomerPromotions,
  calculateTotalDiscount,
  formatPromotionDisplay,
  isExpiringSoon,
  getUpcomingPromotions,
  type PromotionContext,
  type ApplicablePromotion,
  type PromoCodeResult
} from './promotionEngineService';

// ============================================
// COMPETITOR CONTEXT SERVICE
// ============================================
export {
  getCompetitorAnalysis,
  getServiceCompetitorContext,
  getLocationCompetitorContext,
  getTopCompetitors,
  getObjectionHandlers,
  getPricingRecommendation,
  type CompetitorAnalysis,
  type ServiceCompetitorContext,
  type LocationCompetitorContext
} from './competitorContextService';

// ============================================
// SOCIAL PROOF SERVICE
// ============================================
export {
  getSocialProofPackage,
  getQuoteSocialProof,
  getServiceTestimonials,
  getLocationTestimonials,
  getReviewSummary,
  formatReviewForDisplay,
  getReviewDistribution,
  hasStrongLocalProof,
  type SocialProofPackage,
  type QuoteSocialProof,
  type TrustBadge,
  type SocialStatistics
} from './socialProofService';

// ============================================
// LEGACY SERVICES (existing)
// ============================================
// These may need to be migrated to new patterns

// pricingRegistry - if exists, will be superseded by pricingEngineService
export * from './pricingRegistry';

// quoteValidation - maintains quote integrity rules
export * from './quoteValidation';

// geminiService - AI image analysis (remains as-is)
// Note: geminiService will be enhanced to use generateAIPromptContext
