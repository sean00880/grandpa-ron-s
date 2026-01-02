/**
 * PROMOTION ENGINE SERVICE
 * Manages promotional offers, discount validation, and application
 *
 * Integration: promotionRegistry
 * Usage: Quote display, checkout, promo code validation
 */

import {
  promotionRegistry,
  type Promotion,
  type PromotionType
} from '@/.growsz/registries';

export interface PromotionContext {
  serviceIds: string[];
  locationSlug: string;
  customerType: 'new' | 'existing';
  orderValue: number;
}

export interface ApplicablePromotion {
  promotion: Promotion;
  discountAmount: number;
  discountPercent: number;
  eligibilityReason: string;
  stackable: boolean;
}

export interface PromoCodeResult {
  valid: boolean;
  promotion?: Promotion;
  discountAmount?: number;
  error?: string;
  suggestion?: string;
}

/**
 * Find all applicable auto-apply promotions for a quote context
 */
export function findApplicablePromotions(
  context: PromotionContext
): ApplicablePromotion[] {
  const promotions: ApplicablePromotion[] = [];

  // Get auto-apply promotions from registry
  const autoPromotions = promotionRegistry.getAutoApplyPromotions(
    context.serviceIds,
    context.locationSlug,
    context.customerType,
    context.orderValue
  );

  autoPromotions.forEach(promo => {
    const discountAmount = promotionRegistry.calculateDiscount(promo, context.orderValue);

    promotions.push({
      promotion: promo,
      discountAmount,
      discountPercent: calculateDiscountPercent(promo, context.orderValue, discountAmount),
      eligibilityReason: getEligibilityReason(promo, context),
      stackable: isStackable(promo)
    });
  });

  // Sort by discount amount (highest first)
  return promotions.sort((a, b) => b.discountAmount - a.discountAmount);
}

/**
 * Validate and apply a promo code
 */
export function validatePromoCode(
  code: string,
  context: PromotionContext
): PromoCodeResult {
  const result = promotionRegistry.validateCode(
    code,
    context.serviceIds,
    context.locationSlug,
    context.customerType,
    context.orderValue
  );

  if (!result.valid) {
    return {
      valid: false,
      error: result.error,
      suggestion: getSuggestion(result.error, context)
    };
  }

  const discountAmount = promotionRegistry.calculateDiscount(
    result.promotion!,
    context.orderValue
  );

  return {
    valid: true,
    promotion: result.promotion,
    discountAmount
  };
}

/**
 * Get banner promotions for site-wide display
 */
export function getBannerPromotions(): Promotion[] {
  return promotionRegistry.getDisplayPromotions()
    .filter(p => p.bannerText)
    .slice(0, 2); // Max 2 banners
}

/**
 * Get promotions for a specific service (for service pages)
 */
export function getServicePromotions(serviceId: string): Promotion[] {
  return promotionRegistry.getActivePromotions()
    .filter(p =>
      p.displayOnSite &&
      (p.applicableServices === 'all' ||
       (p.applicableServices as string[]).includes(serviceId))
    );
}

/**
 * Get promotions for a specific location (for location pages)
 */
export function getLocationPromotions(locationSlug: string): Promotion[] {
  return promotionRegistry.getActivePromotions()
    .filter(p =>
      p.displayOnSite &&
      (p.applicableLocations === 'all' ||
       (p.applicableLocations as string[]).includes(locationSlug))
    );
}

/**
 * Get new customer promotions
 */
export function getNewCustomerPromotions(): Promotion[] {
  return promotionRegistry.getActivePromotions()
    .filter(p =>
      p.displayOnSite &&
      (p.customerType === 'new' || p.customerType === 'all')
    );
}

/**
 * Calculate total discount from multiple promotions (handling stacking rules)
 */
export function calculateTotalDiscount(
  applicablePromotions: ApplicablePromotion[],
  orderValue: number
): {
  totalDiscount: number;
  appliedPromotions: ApplicablePromotion[];
  skippedPromotions: ApplicablePromotion[];
} {
  const appliedPromotions: ApplicablePromotion[] = [];
  const skippedPromotions: ApplicablePromotion[] = [];
  let totalDiscount = 0;
  let hasPercentageDiscount = false;

  // Sort by discount amount
  const sorted = [...applicablePromotions].sort((a, b) => b.discountAmount - a.discountAmount);

  for (const promo of sorted) {
    // Check stacking rules
    if (promo.promotion.type === 'percentage') {
      if (hasPercentageDiscount && !promo.stackable) {
        skippedPromotions.push(promo);
        continue;
      }
      hasPercentageDiscount = true;
    }

    // Apply promotion
    appliedPromotions.push(promo);
    totalDiscount += promo.discountAmount;
  }

  // Cap total discount at order value
  totalDiscount = Math.min(totalDiscount, orderValue);

  return {
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    appliedPromotions,
    skippedPromotions
  };
}

/**
 * Format promotion for display
 */
export function formatPromotionDisplay(promotion: Promotion): {
  title: string;
  description: string;
  badge: string;
  code?: string;
  expiresText?: string;
} {
  let badge = '';

  switch (promotion.type) {
    case 'percentage':
      badge = `${(promotion.value * 100).toFixed(0)}% OFF`;
      break;
    case 'fixed':
    case 'bundle':
      badge = `$${promotion.value} OFF`;
      break;
    case 'referral':
      badge = `$${promotion.value} CREDIT`;
      break;
    case 'free-addon':
      badge = 'FREE UPGRADE';
      break;
  }

  // Calculate expiry text
  const endDate = new Date(promotion.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let expiresText: string | undefined;
  if (daysLeft <= 7) {
    expiresText = daysLeft === 1 ? 'Expires tomorrow!' : `Expires in ${daysLeft} days`;
  } else if (daysLeft <= 30) {
    expiresText = `Valid through ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  return {
    title: promotion.name,
    description: promotion.description,
    badge,
    code: promotion.code,
    expiresText
  };
}

/**
 * Check if a promotion is expiring soon (within 7 days)
 */
export function isExpiringSoon(promotion: Promotion): boolean {
  const endDate = new Date(promotion.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysLeft <= 7 && daysLeft > 0;
}

/**
 * Get upcoming promotions for marketing calendar
 */
export function getUpcomingPromotions(): Promotion[] {
  return promotionRegistry.getUpcomingPromotions();
}

// Helper functions

function calculateDiscountPercent(
  promotion: Promotion,
  orderValue: number,
  discountAmount: number
): number {
  if (promotion.type === 'percentage') {
    return promotion.value * 100;
  }
  return orderValue > 0 ? (discountAmount / orderValue) * 100 : 0;
}

function getEligibilityReason(promotion: Promotion, context: PromotionContext): string {
  if (promotion.customerType === 'new' && context.customerType === 'new') {
    return 'New customer welcome offer';
  }

  if (promotion.type === 'bundle') {
    return 'Bundle discount for multiple services';
  }

  if (promotion.applicableLocations !== 'all') {
    return 'Location-specific offer';
  }

  return 'Auto-applied based on your order';
}

function isStackable(promotion: Promotion): boolean {
  // Percentage discounts typically don't stack
  // Fixed and bundle discounts can stack
  return promotion.type !== 'percentage';
}

function getSuggestion(error: string | undefined, context: PromotionContext): string | undefined {
  if (!error) return undefined;

  if (error.includes('new customers')) {
    return 'Check out our referral program for existing customer benefits!';
  }

  if (error.includes('minimum order')) {
    return 'Add more services to qualify for this promotion.';
  }

  if (error.includes('expired')) {
    const current = getBannerPromotions();
    if (current.length > 0 && current[0].code) {
      return `Try code ${current[0].code} for our current promotion!`;
    }
  }

  return undefined;
}

export default {
  findApplicablePromotions,
  validatePromoCode,
  getBannerPromotions,
  getServicePromotions,
  getLocationPromotions,
  getNewCustomerPromotions,
  calculateTotalDiscount,
  formatPromotionDisplay,
  isExpiringSoon,
  getUpcomingPromotions
};
