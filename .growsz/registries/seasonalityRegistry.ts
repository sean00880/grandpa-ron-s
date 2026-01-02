/**
 * SEASONALITY REGISTRY
 * Seasonal demand patterns and pricing modifiers for Central Ohio
 *
 * Purpose: Dynamic pricing, marketing emphasis, and resource planning
 * Usage: Quote generation, marketing calendar, staffing decisions
 */

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface SeasonalModifier {
  serviceId: string;
  season: Season;
  demandLevel: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  demandMultiplier: number; // 0.5 to 2.0 for capacity planning
  priceModifier: number; // -0.15 to +0.20 (percentage adjustment)
  leadTimeDays: { min: number; max: number };
  marketingEmphasis: 'primary' | 'secondary' | 'minimal' | 'none';
  suggestedPromotion?: string;
  marketingMessage?: string;
  peakWeeks?: number[]; // Week numbers (1-52) of highest demand
}

export interface MonthlyForecast {
  month: Month;
  monthName: string;
  season: Season;
  revenueIndex: number; // 0-100, relative to peak month
  laborNeed: 'minimal' | 'reduced' | 'normal' | 'elevated' | 'peak';
  primaryServices: string[];
  marketingFocus: string;
  weatherConsiderations: string;
}

// ============================================
// SEASONAL MODIFIERS BY SERVICE
// ============================================

const seasonalModifiers: SeasonalModifier[] = [
  // MULCHING
  {
    serviceId: 'mulching',
    season: 'spring',
    demandLevel: 'very-high',
    demandMultiplier: 2.0,
    priceModifier: 0.05, // 5% premium in peak season
    leadTimeDays: { min: 5, max: 14 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Early Bird Mulch Special - Book by March 15 for 10% off',
    marketingMessage: 'Refresh your beds for spring! Premium mulch, professional installation.',
    peakWeeks: [12, 13, 14, 15, 16, 17, 18]
  },
  {
    serviceId: 'mulching',
    season: 'summer',
    demandLevel: 'medium',
    demandMultiplier: 1.0,
    priceModifier: 0,
    leadTimeDays: { min: 3, max: 7 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Beat the heat - mulch helps retain moisture and keep roots cool.'
  },
  {
    serviceId: 'mulching',
    season: 'fall',
    demandLevel: 'high',
    demandMultiplier: 1.5,
    priceModifier: 0,
    leadTimeDays: { min: 3, max: 10 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Fall Refresh Package - Mulch + Cleanup combo',
    marketingMessage: 'Protect your plants through winter with fresh mulch.',
    peakWeeks: [40, 41, 42, 43, 44]
  },
  {
    serviceId: 'mulching',
    season: 'winter',
    demandLevel: 'very-low',
    demandMultiplier: 0.2,
    priceModifier: -0.10, // 10% discount to fill schedule
    leadTimeDays: { min: 1, max: 3 },
    marketingEmphasis: 'none'
  },

  // LAWN MOWING
  {
    serviceId: 'mowing',
    season: 'spring',
    demandLevel: 'very-high',
    demandMultiplier: 1.8,
    priceModifier: 0,
    leadTimeDays: { min: 2, max: 5 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Lock in your weekly spot - Spring scheduling now open',
    marketingMessage: 'First mow of the season? We handle the spring surge.',
    peakWeeks: [14, 15, 16, 17, 18, 19, 20]
  },
  {
    serviceId: 'mowing',
    season: 'summer',
    demandLevel: 'very-high',
    demandMultiplier: 2.0,
    priceModifier: 0.05, // Slight premium during peak demand
    leadTimeDays: { min: 1, max: 3 },
    marketingEmphasis: 'secondary', // Already booked, focus on retention
    marketingMessage: 'Keep your lawn pristine all summer with weekly service.'
  },
  {
    serviceId: 'mowing',
    season: 'fall',
    demandLevel: 'high',
    demandMultiplier: 1.5,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 3 },
    marketingEmphasis: 'secondary',
    suggestedPromotion: 'Final mows include leaf mulching',
    marketingMessage: 'Keep mowing through fall for a healthier spring lawn.',
    peakWeeks: [36, 37, 38, 39, 40]
  },
  {
    serviceId: 'mowing',
    season: 'winter',
    demandLevel: 'very-low',
    demandMultiplier: 0.1,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 1 },
    marketingEmphasis: 'none'
  },

  // TREE TRIMMING
  {
    serviceId: 'tree-trimming',
    season: 'spring',
    demandLevel: 'high',
    demandMultiplier: 1.4,
    priceModifier: 0,
    leadTimeDays: { min: 5, max: 14 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Spring pruning for flowering trees - timing matters!'
  },
  {
    serviceId: 'tree-trimming',
    season: 'summer',
    demandLevel: 'medium',
    demandMultiplier: 1.0,
    priceModifier: 0,
    leadTimeDays: { min: 3, max: 10 },
    marketingEmphasis: 'secondary',
    suggestedPromotion: 'Storm season prep - remove hazardous branches now',
    marketingMessage: 'Summer storms coming. Protect your property with preventive trimming.'
  },
  {
    serviceId: 'tree-trimming',
    season: 'fall',
    demandLevel: 'high',
    demandMultiplier: 1.3,
    priceModifier: 0,
    leadTimeDays: { min: 5, max: 14 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Winter prep - trim before the snow loads',
    marketingMessage: 'Best time for major pruning - trees are entering dormancy.',
    peakWeeks: [44, 45, 46, 47, 48]
  },
  {
    serviceId: 'tree-trimming',
    season: 'winter',
    demandLevel: 'medium',
    demandMultiplier: 0.8,
    priceModifier: -0.10, // Winter discount
    leadTimeDays: { min: 3, max: 7 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Winter Tree Care Special - 15% off major pruning',
    marketingMessage: 'Dormant season = perfect for major tree work. Book now!'
  },

  // LANDSCAPING
  {
    serviceId: 'landscaping',
    season: 'spring',
    demandLevel: 'very-high',
    demandMultiplier: 2.0,
    priceModifier: 0.10, // Premium during peak
    leadTimeDays: { min: 14, max: 30 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Spring Transformation Package - Design + Install',
    marketingMessage: 'Now booking spring installations. Transform your property!',
    peakWeeks: [12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  {
    serviceId: 'landscaping',
    season: 'summer',
    demandLevel: 'high',
    demandMultiplier: 1.5,
    priceModifier: 0.05,
    leadTimeDays: { min: 10, max: 21 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Summer installations - enjoy your new landscape this season!'
  },
  {
    serviceId: 'landscaping',
    season: 'fall',
    demandLevel: 'very-high',
    demandMultiplier: 1.8,
    priceModifier: 0,
    leadTimeDays: { min: 10, max: 21 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Fall is the BEST time to plant - roots establish over winter',
    marketingMessage: 'Fall planting = stronger plants next spring. Expert installation.',
    peakWeeks: [36, 37, 38, 39, 40, 41, 42]
  },
  {
    serviceId: 'landscaping',
    season: 'winter',
    demandLevel: 'low',
    demandMultiplier: 0.3,
    priceModifier: -0.15, // Deep discount for off-season
    leadTimeDays: { min: 7, max: 14 },
    marketingEmphasis: 'minimal',
    suggestedPromotion: 'Winter Design Consultations - Plan now, install in spring',
    marketingMessage: 'Book your spring project now at winter rates!'
  },

  // LEAF REMOVAL
  {
    serviceId: 'leaf-removal',
    season: 'spring',
    demandLevel: 'low',
    demandMultiplier: 0.3,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 3 },
    marketingEmphasis: 'none'
  },
  {
    serviceId: 'leaf-removal',
    season: 'summer',
    demandLevel: 'very-low',
    demandMultiplier: 0.1,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 2 },
    marketingEmphasis: 'none'
  },
  {
    serviceId: 'leaf-removal',
    season: 'fall',
    demandLevel: 'very-high',
    demandMultiplier: 2.5,
    priceModifier: 0.10, // Premium during peak
    leadTimeDays: { min: 3, max: 10 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Weekly Fall Cleanup - Never rake again',
    marketingMessage: 'Leaves falling? We handle it. Weekly or one-time service.',
    peakWeeks: [43, 44, 45, 46, 47, 48]
  },
  {
    serviceId: 'leaf-removal',
    season: 'winter',
    demandLevel: 'medium',
    demandMultiplier: 0.8,
    priceModifier: 0,
    leadTimeDays: { min: 2, max: 5 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Final fall cleanup before the snow flies.'
  },

  // SNOW REMOVAL
  {
    serviceId: 'snow-removal',
    season: 'spring',
    demandLevel: 'low',
    demandMultiplier: 0.3,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 1 },
    marketingEmphasis: 'none'
  },
  {
    serviceId: 'snow-removal',
    season: 'summer',
    demandLevel: 'very-low',
    demandMultiplier: 0,
    priceModifier: 0,
    leadTimeDays: { min: 0, max: 0 },
    marketingEmphasis: 'none'
  },
  {
    serviceId: 'snow-removal',
    season: 'fall',
    demandLevel: 'medium',
    demandMultiplier: 1.0,
    priceModifier: -0.05, // Early bird discount
    leadTimeDays: { min: 1, max: 7 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Book your snow contract by Nov 1 - lock in rates',
    marketingMessage: 'Winter is coming. Secure your snow removal spot now!',
    peakWeeks: [44, 45, 46, 47]
  },
  {
    serviceId: 'snow-removal',
    season: 'winter',
    demandLevel: 'very-high',
    demandMultiplier: 2.0,
    priceModifier: 0.15, // Premium during active snow
    leadTimeDays: { min: 0, max: 1 }, // Same day for snow events
    marketingEmphasis: 'primary',
    marketingMessage: '24/7 snow response. Contract customers get priority.'
  },

  // OVERSEEDING
  {
    serviceId: 'overseeding',
    season: 'spring',
    demandLevel: 'medium',
    demandMultiplier: 1.0,
    priceModifier: 0,
    leadTimeDays: { min: 5, max: 10 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Spring seeding available - but fall is better!'
  },
  {
    serviceId: 'overseeding',
    season: 'summer',
    demandLevel: 'very-low',
    demandMultiplier: 0.2,
    priceModifier: 0,
    leadTimeDays: { min: 3, max: 7 },
    marketingEmphasis: 'none'
  },
  {
    serviceId: 'overseeding',
    season: 'fall',
    demandLevel: 'very-high',
    demandMultiplier: 2.5,
    priceModifier: 0.05,
    leadTimeDays: { min: 7, max: 14 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Fall is THE time to seed - Aeration + Overseeding packages',
    marketingMessage: 'Perfect weather for seeding. Get a thicker lawn by spring!',
    peakWeeks: [35, 36, 37, 38, 39, 40, 41]
  },
  {
    serviceId: 'overseeding',
    season: 'winter',
    demandLevel: 'very-low',
    demandMultiplier: 0.1,
    priceModifier: 0,
    leadTimeDays: { min: 1, max: 3 },
    marketingEmphasis: 'none'
  },

  // HARDSCAPING
  {
    serviceId: 'hardscaping',
    season: 'spring',
    demandLevel: 'very-high',
    demandMultiplier: 2.0,
    priceModifier: 0.10,
    leadTimeDays: { min: 21, max: 45 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Patio Season - Design now, enjoy all summer',
    marketingMessage: 'Dream patio? Let\'s make it happen this spring.',
    peakWeeks: [14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  {
    serviceId: 'hardscaping',
    season: 'summer',
    demandLevel: 'high',
    demandMultiplier: 1.5,
    priceModifier: 0.05,
    leadTimeDays: { min: 14, max: 30 },
    marketingEmphasis: 'secondary',
    marketingMessage: 'Summer installations - enjoy your outdoor living space!'
  },
  {
    serviceId: 'hardscaping',
    season: 'fall',
    demandLevel: 'high',
    demandMultiplier: 1.5,
    priceModifier: 0,
    leadTimeDays: { min: 14, max: 30 },
    marketingEmphasis: 'primary',
    suggestedPromotion: 'Fall fire pit season - Install before the holidays',
    marketingMessage: 'Perfect fall weather for hardscape installation.',
    peakWeeks: [36, 37, 38, 39, 40, 41]
  },
  {
    serviceId: 'hardscaping',
    season: 'winter',
    demandLevel: 'low',
    demandMultiplier: 0.3,
    priceModifier: -0.15,
    leadTimeDays: { min: 7, max: 21 },
    marketingEmphasis: 'minimal',
    suggestedPromotion: 'Winter planning special - Design consultation included',
    marketingMessage: 'Plan your spring hardscape project at winter prices!'
  }
];

// ============================================
// MONTHLY FORECASTS
// ============================================

const monthlyForecasts: MonthlyForecast[] = [
  {
    month: 1,
    monthName: 'January',
    season: 'winter',
    revenueIndex: 15,
    laborNeed: 'minimal',
    primaryServices: ['snow-removal', 'tree-trimming'],
    marketingFocus: 'Snow contracts, spring pre-booking',
    weatherConsiderations: 'Average snowfall 8". Multiple snow events likely.'
  },
  {
    month: 2,
    monthName: 'February',
    season: 'winter',
    revenueIndex: 20,
    laborNeed: 'minimal',
    primaryServices: ['snow-removal', 'tree-trimming'],
    marketingFocus: 'Spring pre-booking, early bird discounts',
    weatherConsiderations: 'Peak snow month. Late month thaw possible.'
  },
  {
    month: 3,
    monthName: 'March',
    season: 'spring',
    revenueIndex: 35,
    laborNeed: 'reduced',
    primaryServices: ['mulching', 'landscaping', 'spring-cleanup'],
    marketingFocus: 'Mulching, spring cleanup campaigns',
    weatherConsiderations: 'Variable - snow early, warm end. Ground thaw.'
  },
  {
    month: 4,
    monthName: 'April',
    season: 'spring',
    revenueIndex: 70,
    laborNeed: 'elevated',
    primaryServices: ['mulching', 'mowing', 'landscaping', 'tree-trimming'],
    marketingFocus: 'Full spring service push, mowing sign-ups',
    weatherConsiderations: 'Rain common. Fast grass growth begins.'
  },
  {
    month: 5,
    monthName: 'May',
    season: 'spring',
    revenueIndex: 90,
    laborNeed: 'peak',
    primaryServices: ['mowing', 'mulching', 'landscaping', 'hardscaping'],
    marketingFocus: 'Hardscaping, outdoor living installations',
    weatherConsiderations: 'Ideal planting weather. Peak growth.'
  },
  {
    month: 6,
    monthName: 'June',
    season: 'summer',
    revenueIndex: 100,
    laborNeed: 'peak',
    primaryServices: ['mowing', 'landscaping', 'hardscaping'],
    marketingFocus: 'Customer retention, referral programs',
    weatherConsiderations: 'Hot and humid. Drought stress possible.'
  },
  {
    month: 7,
    monthName: 'July',
    season: 'summer',
    revenueIndex: 95,
    laborNeed: 'peak',
    primaryServices: ['mowing', 'hardscaping'],
    marketingFocus: 'Heat stress lawn care, irrigation',
    weatherConsiderations: 'Hottest month. Reduced mowing frequency common.'
  },
  {
    month: 8,
    monthName: 'August',
    season: 'summer',
    revenueIndex: 85,
    laborNeed: 'elevated',
    primaryServices: ['mowing', 'landscaping'],
    marketingFocus: 'Fall aeration/seeding pre-booking',
    weatherConsiderations: 'Late summer heat. Fall prep begins.'
  },
  {
    month: 9,
    monthName: 'September',
    season: 'fall',
    revenueIndex: 95,
    laborNeed: 'peak',
    primaryServices: ['overseeding', 'aeration', 'landscaping', 'mowing'],
    marketingFocus: 'Overseeding campaigns, fall planting',
    weatherConsiderations: 'Perfect seeding weather. Ideal temps.'
  },
  {
    month: 10,
    monthName: 'October',
    season: 'fall',
    revenueIndex: 90,
    laborNeed: 'peak',
    primaryServices: ['leaf-removal', 'mulching', 'landscaping', 'tree-trimming'],
    marketingFocus: 'Leaf cleanup, winterization',
    weatherConsiderations: 'Leaves falling. First frost possible end of month.'
  },
  {
    month: 11,
    monthName: 'November',
    season: 'fall',
    revenueIndex: 65,
    laborNeed: 'elevated',
    primaryServices: ['leaf-removal', 'snow-removal', 'tree-trimming'],
    marketingFocus: 'Final cleanups, snow contract finalization',
    weatherConsiderations: 'Cold snaps. Snow possible. Cleanup window closing.'
  },
  {
    month: 12,
    monthName: 'December',
    season: 'winter',
    revenueIndex: 25,
    laborNeed: 'reduced',
    primaryServices: ['snow-removal', 'tree-trimming'],
    marketingFocus: 'Holiday push, next year pre-booking',
    weatherConsiderations: 'Snow events begin. Holiday downtime.'
  }
];

// ============================================
// SEASONALITY REGISTRY CLASS
// ============================================

class SeasonalityRegistry {
  private modifiers: SeasonalModifier[];
  private forecasts: MonthlyForecast[];

  constructor() {
    this.modifiers = seasonalModifiers;
    this.forecasts = monthlyForecasts;
  }

  /**
   * Get current season based on date
   */
  getCurrentSeason(date: Date = new Date()): Season {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  /**
   * Get modifier for a service in a season
   */
  getModifier(serviceId: string, season: Season): SeasonalModifier | undefined {
    return this.modifiers.find(
      m => m.serviceId === serviceId && m.season === season
    );
  }

  /**
   * Get current modifier for a service
   */
  getCurrentModifier(serviceId: string): SeasonalModifier | undefined {
    return this.getModifier(serviceId, this.getCurrentSeason());
  }

  /**
   * Calculate adjusted price
   */
  getAdjustedPrice(basePrice: number, serviceId: string, season?: Season): number {
    const modifier = season
      ? this.getModifier(serviceId, season)
      : this.getCurrentModifier(serviceId);

    if (!modifier) return basePrice;
    return basePrice * (1 + modifier.priceModifier);
  }

  /**
   * Get services with high demand in current season
   */
  getHighDemandServices(): SeasonalModifier[] {
    const currentSeason = this.getCurrentSeason();
    return this.modifiers
      .filter(m =>
        m.season === currentSeason &&
        (m.demandLevel === 'high' || m.demandLevel === 'very-high')
      )
      .sort((a, b) => b.demandMultiplier - a.demandMultiplier);
  }

  /**
   * Get marketing-priority services for current season
   */
  getMarketingPriorityServices(): SeasonalModifier[] {
    const currentSeason = this.getCurrentSeason();
    return this.modifiers.filter(m =>
      m.season === currentSeason && m.marketingEmphasis === 'primary'
    );
  }

  /**
   * Get monthly forecast
   */
  getMonthlyForecast(month: Month): MonthlyForecast | undefined {
    return this.forecasts.find(f => f.month === month);
  }

  /**
   * Get current month forecast
   */
  getCurrentMonthForecast(): MonthlyForecast | undefined {
    const currentMonth = (new Date().getMonth() + 1) as Month;
    return this.getMonthlyForecast(currentMonth);
  }

  /**
   * Get all forecasts for planning
   */
  getAllForecasts(): MonthlyForecast[] {
    return this.forecasts;
  }

  /**
   * Get peak months (top 25% by revenue)
   */
  getPeakMonths(): MonthlyForecast[] {
    const sorted = [...this.forecasts].sort((a, b) => b.revenueIndex - a.revenueIndex);
    return sorted.slice(0, 3);
  }

  /**
   * Get slow months (bottom 25% by revenue)
   */
  getSlowMonths(): MonthlyForecast[] {
    const sorted = [...this.forecasts].sort((a, b) => a.revenueIndex - b.revenueIndex);
    return sorted.slice(0, 3);
  }
}

export const seasonalityRegistry = new SeasonalityRegistry();
