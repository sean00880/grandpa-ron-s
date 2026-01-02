/**
 * COMPETITOR CONTEXT SERVICE
 * Provides competitive intelligence for quote optimization
 *
 * Integration: competitorRegistry
 * Usage: Quote positioning, pricing strategy, sales talking points
 */

import {
  competitorRegistry,
  type Competitor
} from '@/.growsz/registries';

export interface CompetitorAnalysis {
  primaryCompetitors: Competitor[];
  avgCompetitorPrice: number;
  pricePosition: 'below' | 'at' | 'above';
  priceGapPercent: number;
  competitiveAdvantages: string[];
  weaknesses: string[];
  differentiators: string[];
  talkingPoints: string[];
}

export interface ServiceCompetitorContext {
  serviceId: string;
  competitorOfferings: Array<{
    competitor: Competitor;
    hasService: boolean;
    estimatedPrice?: number;
    qualityLevel?: 'budget' | 'standard' | 'premium';
  }>;
  marketPosition: string;
  uniqueSellingPoints: string[];
}

export interface LocationCompetitorContext {
  locationSlug: string;
  activeCompetitors: Competitor[];
  marketSaturation: 'low' | 'medium' | 'high';
  competitorDensity: number;
  opportunityAreas: string[];
}

/**
 * Get comprehensive competitor analysis for a quote
 */
export function getCompetitorAnalysis(
  locationSlug: string,
  serviceIds: string[],
  ourPrice: number
): CompetitorAnalysis {
  // Get competitors in the location
  const locationCompetitors = competitorRegistry.getCompetitorsByLocation(locationSlug);

  // If no location-specific competitors, get all competitors
  const competitors = locationCompetitors.length > 0
    ? locationCompetitors
    : competitorRegistry.getAllCompetitors();

  // Get gap analysis for all services
  const gapAnalyses = serviceIds.map(serviceId =>
    competitorRegistry.analyzeGaps(locationSlug, serviceId)
  );

  // Calculate average competitor price (rough estimate based on our price and typical market)
  const avgCompetitorPrice = estimateCompetitorPrice(ourPrice, competitors);

  // Determine price position
  const priceDiff = ourPrice - avgCompetitorPrice;
  const priceGapPercent = (priceDiff / avgCompetitorPrice) * 100;

  let pricePosition: 'below' | 'at' | 'above';
  if (priceGapPercent < -5) pricePosition = 'below';
  else if (priceGapPercent > 5) pricePosition = 'above';
  else pricePosition = 'at';

  // Aggregate advantages and weaknesses
  const advantagesSet = new Set<string>();
  const weaknessesSet = new Set<string>();

  gapAnalyses.forEach(analysis => {
    analysis.ourAdvantages.forEach(a => advantagesSet.add(a));
    analysis.ourWeaknesses.forEach(w => weaknessesSet.add(w));
  });

  // Generate talking points based on position and advantages
  const talkingPoints = generateTalkingPoints(
    pricePosition,
    Array.from(advantagesSet),
    competitors
  );

  // Get differentiators
  const differentiators = getDifferentiators(competitors);

  return {
    primaryCompetitors: competitors.slice(0, 5),
    avgCompetitorPrice,
    pricePosition,
    priceGapPercent: Math.round(priceGapPercent * 10) / 10,
    competitiveAdvantages: Array.from(advantagesSet),
    weaknesses: Array.from(weaknessesSet),
    differentiators,
    talkingPoints
  };
}

/**
 * Get service-specific competitor context
 */
export function getServiceCompetitorContext(
  serviceId: string,
  locationSlug?: string
): ServiceCompetitorContext {
  const allCompetitors = competitorRegistry.getAllCompetitors();

  // Analyze which competitors offer this service
  const competitorOfferings = allCompetitors.map(competitor => {
    const hasService = competitor.services.includes(serviceId);

    return {
      competitor,
      hasService,
      estimatedPrice: hasService ? estimateServicePrice(competitor, serviceId) : undefined,
      qualityLevel: getCompetitorQualityLevel(competitor)
    };
  });

  // Determine market position
  const competitorsWithService = competitorOfferings.filter(c => c.hasService);
  const marketPosition = getMarketPositionDescription(
    competitorsWithService.length,
    allCompetitors.length
  );

  // Generate unique selling points for this service
  const uniqueSellingPoints = generateServiceUSPs(serviceId, competitorOfferings);

  return {
    serviceId,
    competitorOfferings,
    marketPosition,
    uniqueSellingPoints
  };
}

/**
 * Get location-specific competitor context
 */
export function getLocationCompetitorContext(
  locationSlug: string
): LocationCompetitorContext {
  const locationCompetitors = competitorRegistry.getCompetitorsByLocation(locationSlug);
  const allCompetitors = competitorRegistry.getAllCompetitors();

  // Calculate market saturation
  const competitorDensity = locationCompetitors.length;
  let marketSaturation: 'low' | 'medium' | 'high';

  if (competitorDensity <= 2) marketSaturation = 'low';
  else if (competitorDensity <= 5) marketSaturation = 'medium';
  else marketSaturation = 'high';

  // Identify opportunity areas (services we offer but competitors don't)
  const opportunityAreas = identifyOpportunityAreas(locationCompetitors);

  return {
    locationSlug,
    activeCompetitors: locationCompetitors,
    marketSaturation,
    competitorDensity,
    opportunityAreas
  };
}

/**
 * Get top competitors by rating threshold
 */
export function getTopCompetitors(minRating: number = 4.0): Competitor[] {
  return competitorRegistry.getTopRatedCompetitors(minRating);
}

/**
 * Generate sales objection handlers based on competitors
 */
export function getObjectionHandlers(
  competitorName: string,
  ourPrice: number,
  competitorPrice?: number
): string[] {
  const handlers: string[] = [];

  const competitor = competitorRegistry.getAllCompetitors()
    .find(c => c.name.toLowerCase() === competitorName.toLowerCase());

  if (!competitor) {
    return [
      `We focus on quality and reliability - our customers consistently rate us 5 stars.`,
      `Our pricing includes a satisfaction guarantee that many competitors don't offer.`,
      `We provide detailed quotes upfront with no hidden fees.`
    ];
  }

  // Price objection handling
  if (competitorPrice && ourPrice > competitorPrice) {
    const diff = ourPrice - competitorPrice;
    handlers.push(
      `While our price is $${diff.toFixed(0)} higher, our service includes ${getDifferentiatorForCompetitor(competitor)}.`
    );
  }

  // Rating-based handlers
  if (competitor.rating < 4.5) {
    handlers.push(
      `We maintain a higher customer satisfaction rating, which means fewer callbacks and better results.`
    );
  }

  // Service-specific handlers
  if (competitor.weaknesses && competitor.weaknesses.length > 0) {
    handlers.push(
      `Unlike some competitors, we ${addressWeakness(competitor.weaknesses[0])}.`
    );
  }

  // Generic handlers
  handlers.push(
    `We're locally owned and operated - you'll work with the same team every visit.`,
    `Our crews are fully insured and background-checked for your peace of mind.`,
    `We offer flexible scheduling and same-week service when available.`
  );

  return handlers.slice(0, 4);
}

/**
 * Get competitive pricing recommendations
 */
export function getPricingRecommendation(
  serviceId: string,
  locationSlug: string,
  basePrice: number
): {
  recommendedPrice: number;
  adjustmentReason: string;
  confidenceLevel: 'low' | 'medium' | 'high';
} {
  const gapAnalysis = competitorRegistry.analyzeGaps(locationSlug, serviceId);
  const locationContext = getLocationCompetitorContext(locationSlug);

  let adjustment = 0;
  let reason = '';
  let confidence: 'low' | 'medium' | 'high' = 'medium';

  // Adjust based on market saturation
  if (locationContext.marketSaturation === 'low') {
    adjustment = 0.05; // Can price 5% higher in low competition areas
    reason = 'Low competition in area allows premium pricing';
    confidence = 'high';
  } else if (locationContext.marketSaturation === 'high') {
    adjustment = -0.03; // Slightly lower in high competition
    reason = 'Competitive pricing to match saturated market';
    confidence = 'high';
  }

  // Adjust based on our advantages
  if (gapAnalysis.ourAdvantages.length > 3) {
    adjustment += 0.03; // Can price higher with many advantages
    reason = `Strong competitive advantages support premium pricing`;
  }

  const recommendedPrice = Math.round(basePrice * (1 + adjustment) * 100) / 100;

  return {
    recommendedPrice,
    adjustmentReason: reason || 'Standard market pricing',
    confidenceLevel: confidence
  };
}

// Helper functions

function estimateCompetitorPrice(ourPrice: number, competitors: Competitor[]): number {
  // Rough estimate: competitors average about 5-10% different from us
  const avgRating = competitors.reduce((sum, c) => sum + c.rating, 0) / competitors.length;

  // Higher rated competitors tend to charge more
  const ratingFactor = avgRating > 4.5 ? 1.05 : avgRating > 4.0 ? 1.0 : 0.95;

  return Math.round(ourPrice * ratingFactor);
}

function estimateServicePrice(competitor: Competitor, serviceId: string): number {
  // Base estimate on competitor's general pricing tier
  const basePrices: Record<string, number> = {
    'mowing': 50,
    'mulching': 150,
    'aeration': 120,
    'overseeding': 80,
    'leaf-removal': 175,
    'hedge-trimming': 100,
    'spring-cleanup': 200,
    'fall-cleanup': 250,
    'tree-trimming': 300,
    'gutter-cleaning': 150
  };

  const base = basePrices[serviceId] || 100;
  const ratingMultiplier = competitor.rating > 4.5 ? 1.1 : competitor.rating > 4.0 ? 1.0 : 0.9;

  return Math.round(base * ratingMultiplier);
}

function getCompetitorQualityLevel(competitor: Competitor): 'budget' | 'standard' | 'premium' {
  if (competitor.rating >= 4.7) return 'premium';
  if (competitor.rating >= 4.0) return 'standard';
  return 'budget';
}

function getMarketPositionDescription(withService: number, total: number): string {
  const percentage = (withService / total) * 100;

  if (percentage > 80) return 'Highly competitive - most competitors offer this service';
  if (percentage > 50) return 'Moderately competitive - common service offering';
  if (percentage > 20) return 'Opportunity area - fewer competitors offering this';
  return 'Blue ocean - rare service offering among competitors';
}

function generateServiceUSPs(
  serviceId: string,
  offerings: Array<{ competitor: Competitor; hasService: boolean }>
): string[] {
  const usps: string[] = [];

  const competitorsWithService = offerings.filter(o => o.hasService);

  if (competitorsWithService.length < offerings.length / 2) {
    usps.push('Specialized expertise in a service few competitors offer');
  }

  // Service-specific USPs
  const serviceUSPs: Record<string, string[]> = {
    'aeration': [
      'Professional-grade aerating equipment',
      'Optimal timing recommendations for your lawn type'
    ],
    'mulching': [
      'Premium quality mulch from local suppliers',
      'Precise depth application for maximum weed suppression'
    ],
    'mowing': [
      'Consistent weekly schedule',
      'Sharp blades for healthier cut'
    ],
    'leaf-removal': [
      'Complete cleanup including beds and gutters',
      'Environmentally responsible disposal'
    ]
  };

  if (serviceUSPs[serviceId]) {
    usps.push(...serviceUSPs[serviceId]);
  }

  return usps.slice(0, 4);
}

function identifyOpportunityAreas(locationCompetitors: Competitor[]): string[] {
  const opportunities: string[] = [];

  // Services we likely offer that competitors might not
  const premiumServices = [
    'mosquito-treatment',
    'irrigation-repair',
    'landscape-design',
    'drainage-solutions'
  ];

  const competitorServices = new Set(
    locationCompetitors.flatMap(c => c.services)
  );

  premiumServices.forEach(service => {
    if (!competitorServices.has(service)) {
      opportunities.push(service);
    }
  });

  return opportunities;
}

function generateTalkingPoints(
  pricePosition: 'below' | 'at' | 'above',
  advantages: string[],
  competitors: Competitor[]
): string[] {
  const points: string[] = [];

  if (pricePosition === 'below') {
    points.push('Competitive pricing without compromising quality');
  } else if (pricePosition === 'above') {
    points.push('Premium service justified by superior results and reliability');
  }

  if (advantages.length > 0) {
    points.push(`Key advantages: ${advantages.slice(0, 3).join(', ')}`);
  }

  points.push(
    'Locally owned with deep community roots',
    'Fully licensed and insured',
    'Satisfaction guarantee on all services'
  );

  return points.slice(0, 5);
}

function getDifferentiators(competitors: Competitor[]): string[] {
  return [
    'Same-day quote response',
    'Detailed photographic documentation',
    'Flexible scheduling options',
    'Transparent pricing with no hidden fees',
    'Local expertise - we know Columbus lawns'
  ];
}

function getDifferentiatorForCompetitor(competitor: Competitor): string {
  const differentiators = [
    'comprehensive cleanup and debris removal',
    'a satisfaction guarantee',
    'detailed before/after documentation',
    'priority scheduling for repeat customers'
  ];

  return differentiators[Math.floor(Math.random() * differentiators.length)];
}

function addressWeakness(weakness: string): string {
  const addressMap: Record<string, string> = {
    'slow response': 'respond to quote requests within hours, not days',
    'poor communication': 'keep you informed with updates at every stage',
    'inconsistent quality': 'maintain strict quality standards with every visit',
    'hidden fees': 'provide transparent, all-inclusive pricing upfront'
  };

  return addressMap[weakness.toLowerCase()] || 'prioritize customer satisfaction above all';
}

export default {
  getCompetitorAnalysis,
  getServiceCompetitorContext,
  getLocationCompetitorContext,
  getTopCompetitors,
  getObjectionHandlers,
  getPricingRecommendation
};
