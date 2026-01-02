/**
 * SOCIAL PROOF SERVICE
 * Manages reviews, testimonials, and reputation data for quotes
 *
 * Integration: reviewRegistry
 * Usage: Quote pages, trust badges, location pages
 */

import {
  reviewRegistry,
  type Review,
  type ReviewSummary
} from '@/.growsz/registries';

export interface SocialProofPackage {
  overallRating: number;
  totalReviews: number;
  featuredReviews: Review[];
  locationReviews: Review[];
  serviceReviews: Review[];
  recentReviews: Review[];
  trustBadges: TrustBadge[];
  statistics: SocialStatistics;
}

export interface TrustBadge {
  type: 'rating' | 'reviews' | 'experience' | 'guarantee' | 'local' | 'certified';
  label: string;
  value: string;
  icon: string;
}

export interface SocialStatistics {
  averageRating: number;
  fiveStarPercent: number;
  responseRate: string;
  yearsInBusiness: number;
  customersServed: number;
  repeatCustomerRate: number;
}

export interface QuoteSocialProof {
  relevantReviews: Review[];
  trustSignals: string[];
  socialProofText: string;
  ratingDisplay: {
    stars: number;
    count: number;
    label: string;
  };
}

/**
 * Get comprehensive social proof package for a quote context
 */
export function getSocialProofPackage(
  locationSlug?: string,
  serviceIds?: string[]
): SocialProofPackage {
  const summary = reviewRegistry.getSummary();
  const allReviews = reviewRegistry.getAllReviews();

  // Get location-specific reviews
  const locationReviews = locationSlug
    ? reviewRegistry.getReviewsByLocation(locationSlug)
    : [];

  // Get service-specific reviews
  const serviceReviews = serviceIds && serviceIds.length > 0
    ? serviceIds.flatMap(id => reviewRegistry.getReviewsByService(id))
    : [];

  // Get recent reviews (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentReviews = allReviews
    .filter(r => new Date(r.date) >= thirtyDaysAgo)
    .slice(0, 5);

  // Get featured/highlighted reviews
  const featuredReviews = reviewRegistry.getHighlightedReviews().slice(0, 3);

  // Generate trust badges
  const trustBadges = generateTrustBadges(summary);

  // Calculate statistics
  const statistics = calculateStatistics(allReviews, summary);

  return {
    overallRating: summary.averageRating,
    totalReviews: summary.totalReviews,
    featuredReviews,
    locationReviews: locationReviews.slice(0, 5),
    serviceReviews: [...new Map(serviceReviews.map(r => [r.id, r])).values()].slice(0, 5),
    recentReviews,
    trustBadges,
    statistics
  };
}

/**
 * Get social proof specifically for a quote display
 */
export function getQuoteSocialProof(
  locationSlug: string,
  serviceIds: string[]
): QuoteSocialProof {
  const summary = reviewRegistry.getSummary();

  // Get relevant reviews - prioritize location + service matches
  const locationReviews = reviewRegistry.getReviewsByLocation(locationSlug);
  const serviceReviews = serviceIds.flatMap(id => reviewRegistry.getReviewsByService(id));

  // Deduplicate and prioritize high-rating reviews
  const reviewMap = new Map<string, Review>();
  [...locationReviews, ...serviceReviews].forEach(r => {
    if (!reviewMap.has(r.id) || reviewMap.get(r.id)!.rating < r.rating) {
      reviewMap.set(r.id, r);
    }
  });

  const relevantReviews = Array.from(reviewMap.values())
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Generate trust signals
  const trustSignals = generateTrustSignals(summary, locationSlug);

  // Generate social proof text
  const socialProofText = generateSocialProofText(summary, locationReviews.length);

  return {
    relevantReviews,
    trustSignals,
    socialProofText,
    ratingDisplay: {
      stars: summary.averageRating,
      count: summary.totalReviews,
      label: getRatingLabel(summary.averageRating)
    }
  };
}

/**
 * Get best reviews for a specific service
 */
export function getServiceTestimonials(serviceId: string, limit: number = 3): Review[] {
  return reviewRegistry.getReviewsByService(serviceId)
    .filter(r => r.rating >= 4.5)
    .sort((a, b) => {
      // Prioritize reviews with text and high ratings
      const aScore = a.rating + (a.text && a.text.length > 50 ? 1 : 0);
      const bScore = b.rating + (b.text && b.text.length > 50 ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Get location-specific testimonials
 */
export function getLocationTestimonials(locationSlug: string, limit: number = 3): Review[] {
  return reviewRegistry.getReviewsByLocation(locationSlug)
    .filter(r => r.rating >= 4.5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get review summary for display
 */
export function getReviewSummary(): ReviewSummary {
  return reviewRegistry.getSummary();
}

/**
 * Format review for display
 */
export function formatReviewForDisplay(review: Review): {
  authorInitials: string;
  shortText: string;
  dateDisplay: string;
  locationDisplay: string;
  serviceDisplay: string;
} {
  // Get author initials
  const nameParts = review.authorName.split(' ');
  const authorInitials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : nameParts[0][0].toUpperCase();

  // Truncate text
  const maxLength = 150;
  const shortText = review.text && review.text.length > maxLength
    ? review.text.substring(0, maxLength) + '...'
    : review.text || '';

  // Format date
  const date = new Date(review.date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  let dateDisplay: string;
  if (diffDays < 7) dateDisplay = 'This week';
  else if (diffDays < 30) dateDisplay = 'This month';
  else if (diffDays < 90) dateDisplay = date.toLocaleDateString('en-US', { month: 'long' });
  else dateDisplay = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Format location
  const locationDisplay = review.locationSlug
    ? formatLocationName(review.locationSlug)
    : 'Columbus Area';

  // Format service
  const serviceDisplay = review.serviceId
    ? formatServiceName(review.serviceId)
    : 'General Service';

  return {
    authorInitials,
    shortText,
    dateDisplay,
    locationDisplay,
    serviceDisplay
  };
}

/**
 * Get review count by rating
 */
export function getReviewDistribution(): Record<number, number> {
  const allReviews = reviewRegistry.getAllReviews();
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  allReviews.forEach(review => {
    const roundedRating = Math.round(review.rating);
    if (roundedRating >= 1 && roundedRating <= 5) {
      distribution[roundedRating]++;
    }
  });

  return distribution;
}

/**
 * Check if we have strong social proof for a location
 */
export function hasStrongLocalProof(locationSlug: string): boolean {
  const locationReviews = reviewRegistry.getReviewsByLocation(locationSlug);
  const avgRating = locationReviews.reduce((sum, r) => sum + r.rating, 0) / locationReviews.length;

  return locationReviews.length >= 5 && avgRating >= 4.5;
}

// Helper functions

function generateTrustBadges(summary: ReviewSummary): TrustBadge[] {
  const badges: TrustBadge[] = [];

  // Rating badge
  if (summary.averageRating >= 4.5) {
    badges.push({
      type: 'rating',
      label: 'Highly Rated',
      value: `${summary.averageRating.toFixed(1)} stars`,
      icon: 'star'
    });
  }

  // Review count badge
  if (summary.totalReviews >= 50) {
    badges.push({
      type: 'reviews',
      label: 'Trusted',
      value: `${summary.totalReviews}+ reviews`,
      icon: 'users'
    });
  }

  // Experience badge
  badges.push({
    type: 'experience',
    label: 'Established',
    value: '15+ years',
    icon: 'award'
  });

  // Local badge
  badges.push({
    type: 'local',
    label: 'Local',
    value: 'Columbus, OH',
    icon: 'map-pin'
  });

  // Guarantee badge
  badges.push({
    type: 'guarantee',
    label: 'Guaranteed',
    value: '100% Satisfaction',
    icon: 'shield-check'
  });

  return badges;
}

function calculateStatistics(reviews: Review[], summary: ReviewSummary): SocialStatistics {
  const fiveStarCount = reviews.filter(r => r.rating >= 4.8).length;
  const fiveStarPercent = (fiveStarCount / reviews.length) * 100;

  return {
    averageRating: summary.averageRating,
    fiveStarPercent: Math.round(fiveStarPercent),
    responseRate: '< 2 hours',
    yearsInBusiness: 15,
    customersServed: Math.max(summary.totalReviews * 3, 500), // Estimate based on review rate
    repeatCustomerRate: 78
  };
}

function generateTrustSignals(summary: ReviewSummary, locationSlug: string): string[] {
  const signals: string[] = [];

  if (summary.averageRating >= 4.8) {
    signals.push(`${summary.averageRating.toFixed(1)}-star average rating`);
  }

  if (summary.totalReviews >= 50) {
    signals.push(`${summary.totalReviews}+ verified reviews`);
  }

  signals.push('Locally owned & operated');
  signals.push('Fully licensed & insured');
  signals.push('Satisfaction guaranteed');

  return signals.slice(0, 4);
}

function generateSocialProofText(summary: ReviewSummary, localReviewCount: number): string {
  if (localReviewCount >= 10 && summary.averageRating >= 4.5) {
    return `Trusted by your neighbors with ${summary.averageRating.toFixed(1)}-star reviews.`;
  }

  if (summary.averageRating >= 4.8) {
    return `Top-rated lawn care with ${summary.averageRating.toFixed(1)} stars from ${summary.totalReviews}+ happy customers.`;
  }

  if (summary.totalReviews >= 50) {
    return `Join ${summary.totalReviews}+ satisfied customers in the Columbus area.`;
  }

  return `Trusted lawn care professionals serving Columbus since 2009.`;
}

function getRatingLabel(rating: number): string {
  if (rating >= 4.9) return 'Exceptional';
  if (rating >= 4.7) return 'Excellent';
  if (rating >= 4.5) return 'Great';
  if (rating >= 4.0) return 'Good';
  return 'Rated';
}

function formatLocationName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatServiceName(serviceId: string): string {
  const serviceNames: Record<string, string> = {
    'mowing': 'Lawn Mowing',
    'mulching': 'Mulching',
    'aeration': 'Lawn Aeration',
    'overseeding': 'Overseeding',
    'leaf-removal': 'Leaf Removal',
    'hedge-trimming': 'Hedge Trimming',
    'spring-cleanup': 'Spring Cleanup',
    'fall-cleanup': 'Fall Cleanup',
    'tree-trimming': 'Tree Trimming',
    'gutter-cleaning': 'Gutter Cleaning'
  };

  return serviceNames[serviceId] || serviceId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default {
  getSocialProofPackage,
  getQuoteSocialProof,
  getServiceTestimonials,
  getLocationTestimonials,
  getReviewSummary,
  formatReviewForDisplay,
  getReviewDistribution,
  hasStrongLocalProof
};
