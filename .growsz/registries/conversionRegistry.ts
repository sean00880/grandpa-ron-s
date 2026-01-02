/**
 * CONVERSION REGISTRY
 * Lead scoring, conversion tracking, and revenue optimization
 *
 * Purpose: Score leads, track conversions, optimize for profitability
 * Usage: Quote prioritization, marketing ROI, resource allocation
 */

export interface LeadScoreWeights {
  locationValue: number;      // Based on median_income, home_value
  serviceValue: number;       // Based on typical quote value
  urgencyScore: number;       // Based on lead source, time of year
  engagementScore: number;    // Based on site behavior
}

export interface ServiceValueTier {
  serviceId: string;
  avgTicketValue: number;
  profitMargin: number;      // 0-1
  laborIntensity: 'low' | 'medium' | 'high';
  repeatPotential: 'one-time' | 'seasonal' | 'recurring';
  upsellPotential: string[];
}

export interface LocationValueTier {
  slug: string;
  tier: 'premium' | 'high' | 'standard' | 'economy';
  valueMultiplier: number;
  avgContractValue?: number;
  competitionLevel: 'low' | 'medium' | 'high' | 'very-high';
  priorityRank: number;
}

export interface ConversionBenchmark {
  source: string;
  expectedConversionRate: number;
  avgTimeToClose: number; // days
  avgDealValue: number;
  qualityScore: number; // 1-10
}

// ============================================
// SERVICE VALUE TIERS
// ============================================

const serviceValueTiers: ServiceValueTier[] = [
  {
    serviceId: 'hardscaping',
    avgTicketValue: 8500,
    profitMargin: 0.35,
    laborIntensity: 'high',
    repeatPotential: 'one-time',
    upsellPotential: ['outdoor-lighting', 'landscaping', 'irrigation']
  },
  {
    serviceId: 'landscaping',
    avgTicketValue: 4500,
    profitMargin: 0.30,
    laborIntensity: 'high',
    repeatPotential: 'seasonal',
    upsellPotential: ['mulching', 'mowing', 'irrigation']
  },
  {
    serviceId: 'tree-trimming',
    avgTicketValue: 650,
    profitMargin: 0.40,
    laborIntensity: 'high',
    repeatPotential: 'seasonal',
    upsellPotential: ['stump-grinding', 'landscaping']
  },
  {
    serviceId: 'mowing',
    avgTicketValue: 2400, // Annual contract value
    profitMargin: 0.45,
    laborIntensity: 'medium',
    repeatPotential: 'recurring',
    upsellPotential: ['mulching', 'overseeding', 'fertilization']
  },
  {
    serviceId: 'mulching',
    avgTicketValue: 450,
    profitMargin: 0.40,
    laborIntensity: 'medium',
    repeatPotential: 'seasonal',
    upsellPotential: ['landscaping', 'edging']
  },
  {
    serviceId: 'overseeding',
    avgTicketValue: 350,
    profitMargin: 0.50,
    laborIntensity: 'low',
    repeatPotential: 'seasonal',
    upsellPotential: ['mowing', 'fertilization', 'aeration']
  },
  {
    serviceId: 'leaf-removal',
    avgTicketValue: 300,
    profitMargin: 0.55,
    laborIntensity: 'medium',
    repeatPotential: 'seasonal',
    upsellPotential: ['gutter-cleaning', 'winterization']
  },
  {
    serviceId: 'snow-removal',
    avgTicketValue: 1200, // Seasonal contract
    profitMargin: 0.50,
    laborIntensity: 'high',
    repeatPotential: 'recurring',
    upsellPotential: [] // Usually standalone
  }
];

// ============================================
// LOCATION VALUE TIERS
// ============================================

const locationValueTiers: LocationValueTier[] = [
  // Premium Tier - Highest value, worth travel time
  {
    slug: 'new-albany-oh',
    tier: 'premium',
    valueMultiplier: 1.5,
    avgContractValue: 8500,
    competitionLevel: 'very-high',
    priorityRank: 1
  },
  {
    slug: 'upper-arlington-oh',
    tier: 'premium',
    valueMultiplier: 1.4,
    avgContractValue: 7200,
    competitionLevel: 'very-high',
    priorityRank: 2
  },
  {
    slug: 'bexley-oh',
    tier: 'premium',
    valueMultiplier: 1.35,
    avgContractValue: 6800,
    competitionLevel: 'high',
    priorityRank: 3
  },
  {
    slug: 'grandview-heights-oh',
    tier: 'premium',
    valueMultiplier: 1.3,
    avgContractValue: 5500,
    competitionLevel: 'high',
    priorityRank: 4
  },

  // High Value - Primary focus areas
  {
    slug: 'pickerington-oh',
    tier: 'high',
    valueMultiplier: 1.15,
    avgContractValue: 3800,
    competitionLevel: 'medium',
    priorityRank: 5
  },
  {
    slug: 'gahanna-oh',
    tier: 'high',
    valueMultiplier: 1.15,
    avgContractValue: 4200,
    competitionLevel: 'high',
    priorityRank: 6
  },
  {
    slug: 'grove-city-oh',
    tier: 'high',
    valueMultiplier: 1.1,
    avgContractValue: 3500,
    competitionLevel: 'high',
    priorityRank: 7
  },
  {
    slug: 'westerville-oh',
    tier: 'high',
    valueMultiplier: 1.1,
    avgContractValue: 3800,
    competitionLevel: 'high',
    priorityRank: 8
  },

  // Standard Tier - Core service area
  {
    slug: 'lithopolis-oh',
    tier: 'standard',
    valueMultiplier: 1.0,
    avgContractValue: 2800,
    competitionLevel: 'low',
    priorityRank: 9
  },
  {
    slug: 'groveport-oh',
    tier: 'standard',
    valueMultiplier: 1.0,
    avgContractValue: 2600,
    competitionLevel: 'low',
    priorityRank: 10
  },
  {
    slug: 'reynoldsburg-oh',
    tier: 'standard',
    valueMultiplier: 1.0,
    avgContractValue: 2500,
    competitionLevel: 'medium',
    priorityRank: 11
  },
  {
    slug: 'pataskala-oh',
    tier: 'standard',
    valueMultiplier: 0.95,
    avgContractValue: 2800,
    competitionLevel: 'medium',
    priorityRank: 12
  },
  {
    slug: 'blacklick-estates-oh',
    tier: 'standard',
    valueMultiplier: 0.95,
    avgContractValue: 2400,
    competitionLevel: 'low',
    priorityRank: 13
  },

  // Economy Tier - Selective engagement
  {
    slug: 'columbus-oh',
    tier: 'economy', // Large city, very competitive, selective
    valueMultiplier: 0.9,
    avgContractValue: 2200,
    competitionLevel: 'very-high',
    priorityRank: 20
  },
  {
    slug: 'whitehall-oh',
    tier: 'economy',
    valueMultiplier: 0.85,
    avgContractValue: 1800,
    competitionLevel: 'medium',
    priorityRank: 21
  },
  {
    slug: 'lancaster-oh',
    tier: 'standard',
    valueMultiplier: 0.9,
    avgContractValue: 2000,
    competitionLevel: 'medium',
    priorityRank: 15
  }
];

// ============================================
// CONVERSION BENCHMARKS BY SOURCE
// ============================================

const conversionBenchmarks: ConversionBenchmark[] = [
  {
    source: 'organic_search',
    expectedConversionRate: 0.08,
    avgTimeToClose: 5,
    avgDealValue: 850,
    qualityScore: 8
  },
  {
    source: 'google_ads',
    expectedConversionRate: 0.05,
    avgTimeToClose: 3,
    avgDealValue: 650,
    qualityScore: 6
  },
  {
    source: 'referral',
    expectedConversionRate: 0.25,
    avgTimeToClose: 2,
    avgDealValue: 1200,
    qualityScore: 10
  },
  {
    source: 'nextdoor',
    expectedConversionRate: 0.12,
    avgTimeToClose: 4,
    avgDealValue: 550,
    qualityScore: 7
  },
  {
    source: 'facebook',
    expectedConversionRate: 0.04,
    avgTimeToClose: 7,
    avgDealValue: 450,
    qualityScore: 5
  },
  {
    source: 'angi_homeadvisor',
    expectedConversionRate: 0.15,
    avgTimeToClose: 2,
    avgDealValue: 700,
    qualityScore: 7
  },
  {
    source: 'phone_direct',
    expectedConversionRate: 0.35,
    avgTimeToClose: 1,
    avgDealValue: 950,
    qualityScore: 9
  },
  {
    source: 'ai_planner_tool',
    expectedConversionRate: 0.20,
    avgTimeToClose: 3,
    avgDealValue: 1100,
    qualityScore: 9
  },
  {
    source: 'property_audit',
    expectedConversionRate: 0.18,
    avgTimeToClose: 4,
    avgDealValue: 1400,
    qualityScore: 9
  }
];

// ============================================
// LEAD SCORING WEIGHTS
// ============================================

const defaultWeights: LeadScoreWeights = {
  locationValue: 0.30,
  serviceValue: 0.35,
  urgencyScore: 0.20,
  engagementScore: 0.15
};

// ============================================
// CONVERSION REGISTRY CLASS
// ============================================

export interface LeadScoreResult {
  totalScore: number; // 0-100
  priority: 'hot' | 'warm' | 'standard' | 'low';
  components: {
    location: number;
    service: number;
    urgency: number;
    engagement: number;
  };
  expectedValue: number;
  recommendedAction: string;
}

class ConversionRegistry {
  private serviceValues: ServiceValueTier[];
  private locationValues: LocationValueTier[];
  private benchmarks: ConversionBenchmark[];
  private weights: LeadScoreWeights;

  constructor() {
    this.serviceValues = serviceValueTiers;
    this.locationValues = locationValueTiers;
    this.benchmarks = conversionBenchmarks;
    this.weights = defaultWeights;
  }

  /**
   * Get service value tier
   */
  getServiceValue(serviceId: string): ServiceValueTier | undefined {
    return this.serviceValues.find(s => s.serviceId === serviceId);
  }

  /**
   * Get location value tier
   */
  getLocationValue(slug: string): LocationValueTier | undefined {
    return this.locationValues.find(l => l.slug === slug);
  }

  /**
   * Get conversion benchmark for source
   */
  getBenchmark(source: string): ConversionBenchmark | undefined {
    return this.benchmarks.find(b => b.source === source);
  }

  /**
   * Calculate lead score
   */
  calculateLeadScore(
    locationSlug: string,
    serviceIds: string[],
    source: string,
    quoteValue: number,
    engagementSignals: {
      usedAIPlanner?: boolean;
      usedAudit?: boolean;
      multiplePageViews?: boolean;
      returnVisit?: boolean;
    } = {}
  ): LeadScoreResult {
    // Location score (0-100)
    const locationTier = this.getLocationValue(locationSlug);
    const locationScore = locationTier
      ? Math.min(100, locationTier.valueMultiplier * 70)
      : 50;

    // Service score (0-100) - based on highest value service
    const serviceScores = serviceIds.map(id => {
      const tier = this.getServiceValue(id);
      if (!tier) return 50;
      return Math.min(100, (tier.avgTicketValue / 100) + (tier.profitMargin * 100));
    });
    const serviceScore = Math.max(...serviceScores, 50);

    // Urgency score (0-100)
    const benchmark = this.getBenchmark(source);
    let urgencyScore = benchmark ? benchmark.qualityScore * 10 : 50;

    // Boost for high-intent sources
    if (engagementSignals.usedAIPlanner) urgencyScore += 15;
    if (engagementSignals.usedAudit) urgencyScore += 10;
    urgencyScore = Math.min(100, urgencyScore);

    // Engagement score (0-100)
    let engagementScore = 50;
    if (engagementSignals.usedAIPlanner) engagementScore += 20;
    if (engagementSignals.usedAudit) engagementScore += 15;
    if (engagementSignals.multiplePageViews) engagementScore += 10;
    if (engagementSignals.returnVisit) engagementScore += 15;
    engagementScore = Math.min(100, engagementScore);

    // Calculate weighted total
    const totalScore = Math.round(
      locationScore * this.weights.locationValue +
      serviceScore * this.weights.serviceValue +
      urgencyScore * this.weights.urgencyScore +
      engagementScore * this.weights.engagementScore
    );

    // Determine priority
    let priority: LeadScoreResult['priority'];
    if (totalScore >= 80) priority = 'hot';
    else if (totalScore >= 60) priority = 'warm';
    else if (totalScore >= 40) priority = 'standard';
    else priority = 'low';

    // Calculate expected value
    const expectedConversion = benchmark?.expectedConversionRate || 0.10;
    const expectedValue = quoteValue * expectedConversion;

    // Recommend action
    let recommendedAction: string;
    if (priority === 'hot') {
      recommendedAction = 'Call within 1 hour. High-value opportunity.';
    } else if (priority === 'warm') {
      recommendedAction = 'Call within 24 hours. Send detailed estimate.';
    } else if (priority === 'standard') {
      recommendedAction = 'Send automated estimate. Follow up in 48 hours.';
    } else {
      recommendedAction = 'Automated email follow-up sequence.';
    }

    return {
      totalScore,
      priority,
      components: {
        location: Math.round(locationScore),
        service: Math.round(serviceScore),
        urgency: Math.round(urgencyScore),
        engagement: Math.round(engagementScore)
      },
      expectedValue: Math.round(expectedValue),
      recommendedAction
    };
  }

  /**
   * Get high-value locations for targeting
   */
  getHighValueLocations(): LocationValueTier[] {
    return this.locationValues
      .filter(l => l.tier === 'premium' || l.tier === 'high')
      .sort((a, b) => a.priorityRank - b.priorityRank);
  }

  /**
   * Get high-margin services for promotion
   */
  getHighMarginServices(): ServiceValueTier[] {
    return this.serviceValues
      .filter(s => s.profitMargin >= 0.40)
      .sort((a, b) => b.profitMargin - a.profitMargin);
  }

  /**
   * Get upsell opportunities for a service
   */
  getUpsellOpportunities(serviceId: string): ServiceValueTier[] {
    const service = this.getServiceValue(serviceId);
    if (!service) return [];

    return service.upsellPotential
      .map(id => this.getServiceValue(id))
      .filter((s): s is ServiceValueTier => s !== undefined);
  }

  /**
   * Calculate customer lifetime value estimate
   */
  estimateCLV(
    serviceIds: string[],
    locationSlug: string,
    isRecurring: boolean
  ): {
    firstYearValue: number;
    threeYearValue: number;
    fiveYearValue: number;
  } {
    const locationTier = this.getLocationValue(locationSlug);
    const multiplier = locationTier?.valueMultiplier || 1.0;

    let annualValue = 0;
    for (const serviceId of serviceIds) {
      const service = this.getServiceValue(serviceId);
      if (service) {
        annualValue += service.avgTicketValue * multiplier;
      }
    }

    // Recurring customers have higher CLV
    const retentionRate = isRecurring ? 0.85 : 0.60;

    return {
      firstYearValue: Math.round(annualValue),
      threeYearValue: Math.round(annualValue * (1 + retentionRate + Math.pow(retentionRate, 2))),
      fiveYearValue: Math.round(annualValue *
        (1 + retentionRate + Math.pow(retentionRate, 2) + Math.pow(retentionRate, 3) + Math.pow(retentionRate, 4))
      )
    };
  }

  /**
   * Get all benchmarks for reporting
   */
  getAllBenchmarks(): ConversionBenchmark[] {
    return this.benchmarks.sort((a, b) => b.qualityScore - a.qualityScore);
  }
}

export const conversionRegistry = new ConversionRegistry();
