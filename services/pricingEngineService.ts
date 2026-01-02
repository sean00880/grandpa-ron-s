/**
 * PRICING ENGINE SERVICE
 * Dynamic pricing with seasonal adjustments
 *
 * Integration: seasonalityRegistry + pricingRegistry
 * Usage: Quote generation, price display
 */

import {
  seasonalityRegistry,
  type SeasonalModifier,
  type MonthlyForecast,
  type Season
} from '@/.growsz/registries';
import { pricingRegistry, getPricingSummary, type PricingItem } from './pricingRegistry';

export interface SeasonalPriceResult {
  originalPrice: number;
  adjustedPrice: number;
  modifier: number;
  modifierPercent: string;
  season: Season;
  demandLevel: string;
  message?: string;
  leadTimeDays?: { min: number; max: number };
}

export interface QuoteLineItemWithSeasonal {
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  total: number;
  seasonalNote?: string;
  seasonalModifier: number;
}

/**
 * Calculate seasonal price for a service
 */
export function calculateSeasonalPrice(
  serviceId: string,
  basePrice: number,
  date: Date = new Date()
): SeasonalPriceResult {
  const currentSeason = seasonalityRegistry.getCurrentSeason(date);
  const modifier = seasonalityRegistry.getModifier(serviceId, currentSeason);

  if (!modifier) {
    return {
      originalPrice: basePrice,
      adjustedPrice: basePrice,
      modifier: 0,
      modifierPercent: '0%',
      season: currentSeason,
      demandLevel: 'medium',
      message: undefined
    };
  }

  const adjustedPrice = basePrice * (1 + modifier.priceModifier);

  return {
    originalPrice: basePrice,
    adjustedPrice: roundToTwoDecimals(adjustedPrice),
    modifier: modifier.priceModifier,
    modifierPercent: `${(modifier.priceModifier * 100).toFixed(0)}%`,
    season: modifier.season,
    demandLevel: modifier.demandLevel,
    message: getPriceMessage(modifier),
    leadTimeDays: modifier.leadTimeDays
  };
}

/**
 * Apply seasonal pricing to all items in a quote
 */
export function applySeasonalPricing(
  items: Array<{
    serviceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>
): QuoteLineItemWithSeasonal[] {
  return items.map(item => {
    const seasonal = calculateSeasonalPrice(item.serviceId, item.unitPrice);

    return {
      serviceId: item.serviceId,
      description: item.description,
      quantity: item.quantity,
      originalUnitPrice: item.unitPrice,
      unitPrice: seasonal.adjustedPrice,
      total: roundToTwoDecimals(seasonal.adjustedPrice * item.quantity),
      seasonalNote: seasonal.message,
      seasonalModifier: seasonal.modifier
    };
  });
}

/**
 * Calculate quote totals with seasonal adjustments
 */
export function calculateSeasonalQuoteTotals(
  items: QuoteLineItemWithSeasonal[],
  taxRate: number = 0.08
): {
  subtotal: number;
  tax: number;
  total: number;
  totalSavings: number;
  totalPremium: number;
  averageModifier: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const originalSubtotal = items.reduce(
    (sum, item) => sum + (item.originalUnitPrice * item.quantity),
    0
  );

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const difference = subtotal - originalSubtotal;

  return {
    subtotal: roundToTwoDecimals(subtotal),
    tax: roundToTwoDecimals(tax),
    total: roundToTwoDecimals(total),
    totalSavings: difference < 0 ? roundToTwoDecimals(Math.abs(difference)) : 0,
    totalPremium: difference > 0 ? roundToTwoDecimals(difference) : 0,
    averageModifier: items.length > 0
      ? items.reduce((sum, item) => sum + item.seasonalModifier, 0) / items.length
      : 0
  };
}

/**
 * Get seasonal pricing summary for AI prompt injection
 */
export function getSeasonalPricingSummary(): string {
  const baseSummary = getPricingSummary();
  const currentSeason = seasonalityRegistry.getCurrentSeason();
  const highDemandServices = seasonalityRegistry.getHighDemandServices();
  const forecast = seasonalityRegistry.getCurrentMonthForecast();

  let seasonalContext = `
${baseSummary}

SEASONAL CONTEXT (${currentSeason.toUpperCase()}):
`;

  if (highDemandServices.length > 0) {
    seasonalContext += `High-demand services this season: ${highDemandServices.map(s => s.serviceId).join(', ')}\n`;
    seasonalContext += `Demand-based adjustments may apply.\n`;
  }

  if (forecast) {
    seasonalContext += `Primary focus services: ${forecast.primaryServices.join(', ')}\n`;
    seasonalContext += `Weather consideration: ${forecast.weatherConsiderations}\n`;
  }

  return seasonalContext;
}

/**
 * Get current season marketing context
 */
export function getSeasonMarketingContext(): {
  season: Season;
  highDemandServices: SeasonalModifier[];
  marketingPriorities: SeasonalModifier[];
  forecast: MonthlyForecast | undefined;
  suggestedPromotions: string[];
} {
  const currentSeason = seasonalityRegistry.getCurrentSeason();
  const highDemandServices = seasonalityRegistry.getHighDemandServices();
  const marketingPriorities = seasonalityRegistry.getMarketingPriorityServices();
  const forecast = seasonalityRegistry.getCurrentMonthForecast();

  const suggestedPromotions = marketingPriorities
    .filter(m => m.suggestedPromotion)
    .map(m => m.suggestedPromotion!);

  return {
    season: currentSeason,
    highDemandServices,
    marketingPriorities,
    forecast,
    suggestedPromotions
  };
}

/**
 * Check if service is in peak demand
 */
export function isServiceInPeakDemand(serviceId: string): boolean {
  const modifier = seasonalityRegistry.getCurrentModifier(serviceId);
  return modifier !== undefined && (
    modifier.demandLevel === 'high' ||
    modifier.demandLevel === 'very-high'
  );
}

/**
 * Get expected lead time for a service
 */
export function getExpectedLeadTime(serviceId: string): {
  min: number;
  max: number;
  message: string;
} {
  const modifier = seasonalityRegistry.getCurrentModifier(serviceId);

  if (!modifier || !modifier.leadTimeDays) {
    return {
      min: 3,
      max: 7,
      message: 'Typical scheduling 3-7 days out'
    };
  }

  const { min, max } = modifier.leadTimeDays;

  let message = '';
  if (modifier.demandLevel === 'very-high') {
    message = `Peak season - ${min}-${max} day lead time`;
  } else if (modifier.demandLevel === 'high') {
    message = `Busy season - ${min}-${max} day lead time`;
  } else if (modifier.demandLevel === 'low' || modifier.demandLevel === 'very-low') {
    message = `Flexible scheduling available - ${min}-${max} days`;
  } else {
    message = `Typical scheduling ${min}-${max} days`;
  }

  return { min, max, message };
}

/**
 * Helper: Generate price message based on modifier
 */
function getPriceMessage(modifier: SeasonalModifier): string | undefined {
  if (modifier.priceModifier > 0.05) {
    return `Peak ${modifier.demandLevel} season pricing`;
  } else if (modifier.priceModifier < -0.05) {
    return 'Off-season discount applied';
  } else if (modifier.priceModifier > 0) {
    return 'Seasonal adjustment';
  }
  return undefined;
}

/**
 * Helper: Round to two decimal places
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export default {
  calculateSeasonalPrice,
  applySeasonalPricing,
  calculateSeasonalQuoteTotals,
  getSeasonalPricingSummary,
  getSeasonMarketingContext,
  isServiceInPeakDemand,
  getExpectedLeadTime
};
