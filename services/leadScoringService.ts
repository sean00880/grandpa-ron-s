/**
 * LEAD SCORING SERVICE
 * Calculates lead quality scores for quote prioritization
 *
 * Integration: conversionRegistry + locationRegistry
 * Usage: Quote submission flow, CRM prioritization
 */

import {
  conversionRegistry,
  type LeadScoreResult,
  type ServiceValueTier,
  type LocationValueTier
} from '@/.growsz/registries';

export interface LeadScoringInput {
  locationSlug: string;
  serviceIds: string[];
  source: string;
  quoteValue?: number;
  propertySize?: 'small' | 'medium' | 'large' | 'commercial';
  urgency?: 'immediate' | 'within-week' | 'flexible';
  engagement?: {
    usedAIPlanner?: boolean;
    usedAudit?: boolean;
    multiplePageViews?: boolean;
    returnVisit?: boolean;
  };
}

export interface EnhancedLeadScore extends LeadScoreResult {
  urgencyBoost: number;
  propertySizeMultiplier: number;
  serviceContext: (ServiceValueTier | undefined)[];
  locationContext: LocationValueTier | undefined;
  clvEstimate: {
    firstYearValue: number;
    threeYearValue: number;
    fiveYearValue: number;
  };
}

/**
 * Property size to estimated quote value mapping
 */
const PROPERTY_SIZE_ESTIMATES: Record<string, number> = {
  'small': 450,
  'medium': 850,
  'large': 1500,
  'commercial': 3500
};

/**
 * Property size multipliers for lead scoring
 */
const PROPERTY_SIZE_MULTIPLIERS: Record<string, number> = {
  'small': 0.8,
  'medium': 1.0,
  'large': 1.3,
  'commercial': 1.8
};

/**
 * Urgency boost values
 */
const URGENCY_BOOSTS: Record<string, number> = {
  'immediate': 15,
  'within-week': 8,
  'flexible': 0
};

/**
 * Calculate comprehensive lead score with all context
 */
export function calculateLeadScore(input: LeadScoringInput): EnhancedLeadScore {
  // Estimate quote value if not provided
  const estimatedValue = input.quoteValue ||
    estimateValueFromPropertySize(input.propertySize);

  // Get base score from conversion registry
  const baseScore = conversionRegistry.calculateLeadScore(
    input.locationSlug,
    input.serviceIds,
    input.source,
    estimatedValue,
    input.engagement
  );

  // Calculate urgency boost
  const urgencyBoost = input.urgency ? URGENCY_BOOSTS[input.urgency] || 0 : 0;

  // Calculate property size multiplier
  const propertySizeMultiplier = input.propertySize
    ? PROPERTY_SIZE_MULTIPLIERS[input.propertySize] || 1.0
    : 1.0;

  // Apply urgency boost
  let adjustedScore = baseScore.totalScore + urgencyBoost;

  // Apply property size influence (subtle adjustment)
  adjustedScore = Math.round(adjustedScore * (0.9 + propertySizeMultiplier * 0.1));

  // Cap at 100
  adjustedScore = Math.min(100, adjustedScore);

  // Recalculate priority based on adjusted score
  let priority: LeadScoreResult['priority'];
  if (adjustedScore >= 80) priority = 'hot';
  else if (adjustedScore >= 60) priority = 'warm';
  else if (adjustedScore >= 40) priority = 'standard';
  else priority = 'low';

  // Get service and location context
  const serviceContext = input.serviceIds.map(id =>
    conversionRegistry.getServiceValue(id)
  );

  const locationContext = conversionRegistry.getLocationValue(input.locationSlug);

  // Calculate CLV estimate
  const clvEstimate = conversionRegistry.estimateCLV(
    input.serviceIds,
    input.locationSlug,
    false // assuming new customer
  );

  // Update recommended action based on adjusted priority
  const recommendedAction = getRecommendedAction(priority, input.urgency);

  return {
    ...baseScore,
    totalScore: adjustedScore,
    priority,
    recommendedAction,
    urgencyBoost,
    propertySizeMultiplier,
    serviceContext,
    locationContext,
    clvEstimate
  };
}

/**
 * Estimate quote value from property size
 */
function estimateValueFromPropertySize(
  size?: 'small' | 'medium' | 'large' | 'commercial'
): number {
  if (!size) return 850; // Default to medium
  return PROPERTY_SIZE_ESTIMATES[size] || 850;
}

/**
 * Get recommended action based on priority and urgency
 */
function getRecommendedAction(
  priority: LeadScoreResult['priority'],
  urgency?: string
): string {
  if (priority === 'hot') {
    if (urgency === 'immediate') {
      return 'URGENT: Call immediately. Customer needs same-day response.';
    }
    return 'Call within 1 hour. High-value opportunity.';
  }

  if (priority === 'warm') {
    return 'Call within 24 hours. Send detailed estimate promptly.';
  }

  if (priority === 'standard') {
    return 'Send automated estimate. Follow up in 48 hours if no response.';
  }

  return 'Add to nurture sequence. Automated email follow-up.';
}

/**
 * Get quick score without full context (for real-time form feedback)
 */
export function getQuickScore(
  locationSlug: string,
  serviceIds: string[],
  propertySize?: string
): number {
  const locationTier = conversionRegistry.getLocationValue(locationSlug);
  const locationScore = locationTier ? locationTier.valueMultiplier * 60 : 50;

  const serviceScores = serviceIds.map(id => {
    const tier = conversionRegistry.getServiceValue(id);
    return tier ? Math.min(100, tier.avgTicketValue / 100) : 50;
  });
  const avgServiceScore = serviceScores.length > 0
    ? serviceScores.reduce((a, b) => a + b) / serviceScores.length
    : 50;

  const sizeMultiplier = propertySize
    ? PROPERTY_SIZE_MULTIPLIERS[propertySize] || 1.0
    : 1.0;

  return Math.round((locationScore * 0.4 + avgServiceScore * 0.6) * sizeMultiplier);
}

/**
 * Determine if a lead should trigger immediate notification
 */
export function shouldNotifyImmediately(score: EnhancedLeadScore): boolean {
  return (
    score.priority === 'hot' ||
    (score.priority === 'warm' && score.urgencyBoost >= 10) ||
    score.totalScore >= 85
  );
}

/**
 * Get follow-up timeline based on lead score
 */
export function getFollowUpTimeline(score: EnhancedLeadScore): {
  firstContact: string;
  secondContact: string;
  thirdContact: string;
} {
  switch (score.priority) {
    case 'hot':
      return {
        firstContact: 'Within 1 hour',
        secondContact: 'Same day if no response',
        thirdContact: 'Next morning'
      };
    case 'warm':
      return {
        firstContact: 'Within 24 hours',
        secondContact: '48 hours if no response',
        thirdContact: '1 week'
      };
    case 'standard':
      return {
        firstContact: 'Within 48 hours',
        secondContact: '1 week if no response',
        thirdContact: '2 weeks'
      };
    default:
      return {
        firstContact: 'Within 1 week',
        secondContact: '2 weeks if no response',
        thirdContact: '1 month'
      };
  }
}

export default {
  calculateLeadScore,
  getQuickScore,
  shouldNotifyImmediately,
  getFollowUpTimeline
};
