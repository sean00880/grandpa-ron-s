/**
 * REVIEW REGISTRY
 * Customer reviews, testimonials, and reputation management
 *
 * Purpose: Track reviews, manage reputation, generate social proof
 * Usage: Testimonial display, review response, NPS tracking
 */

export interface Review {
  id: string;
  customerId?: string;
  customerName: string;
  locationSlug?: string;
  serviceIds: string[];
  platform: 'google' | 'facebook' | 'nextdoor' | 'yelp' | 'angi' | 'internal';
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content: string;
  date: string;
  verified: boolean;
  responded: boolean;
  responseDate?: string;
  responseContent?: string;
  featured: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  photos?: string[];
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  platformBreakdown: Record<string, { count: number; avgRating: number }>;
  recentTrend: 'improving' | 'stable' | 'declining';
  responseRate: number;
  commonThemes: { theme: string; count: number; sentiment: 'positive' | 'negative' }[];
}

const reviews: Review[] = [
  // Featured Reviews
  {
    id: 'rev-001',
    customerName: 'Sarah M.',
    locationSlug: 'canal-winchester-oh',
    serviceIds: ['mulching', 'landscaping'],
    platform: 'google',
    rating: 5,
    title: 'Transformed our yard!',
    content: "The AI visualization tool was amazing - we could see exactly what our yard would look like before committing. The crew was professional, on time, and the final result exceeded our expectations. Ron even came by to check on the work personally. Highly recommend!",
    date: '2025-12-15',
    verified: true,
    responded: true,
    responseDate: '2025-12-16',
    responseContent: "Thank you so much, Sarah! We loved working on your property. The AI planner really helps customers visualize their dream landscapes. Looking forward to helping with your spring mulching!",
    featured: true,
    sentiment: 'positive',
    themes: ['ai-tool', 'professionalism', 'quality', 'personal-service']
  },
  {
    id: 'rev-002',
    customerName: 'Mike T.',
    locationSlug: 'pickerington-oh',
    serviceIds: ['tree-trimming'],
    platform: 'google',
    rating: 5,
    title: 'Best tree service in the area',
    content: "Had three large oaks that needed trimming. The quote was fair and the work was exceptional. They cleaned up everything and even gave us advice on tree health. Will definitely use again.",
    date: '2025-11-28',
    verified: true,
    responded: true,
    responseDate: '2025-11-29',
    responseContent: "Thanks Mike! Those oaks are beautiful - glad we could help keep them healthy. Remember, we recommend trimming every 2-3 years for optimal tree health.",
    featured: true,
    sentiment: 'positive',
    themes: ['fair-pricing', 'quality', 'cleanup', 'expertise']
  },
  {
    id: 'rev-003',
    customerName: 'Jennifer K.',
    locationSlug: 'lithopolis-oh',
    serviceIds: ['mowing'],
    platform: 'nextdoor',
    rating: 5,
    title: 'Reliable weekly service',
    content: "Been using Grandpa Ron's for our weekly mowing for two seasons now. They're always on schedule, the lawn looks great, and pricing is reasonable. Love that they text before they come.",
    date: '2025-10-20',
    verified: true,
    responded: true,
    responseDate: '2025-10-21',
    responseContent: "Thank you Jennifer! Consistency is key to a healthy lawn, and we appreciate your trust in us. See you next season!",
    featured: true,
    sentiment: 'positive',
    themes: ['reliability', 'consistency', 'communication', 'value']
  },
  {
    id: 'rev-004',
    customerName: 'David R.',
    locationSlug: 'groveport-oh',
    serviceIds: ['hardscaping'],
    platform: 'google',
    rating: 5,
    title: 'Patio of our dreams',
    content: "The design process was incredible. Using their AI tool, we experimented with different paver patterns and colors until we found the perfect look. The installation took about a week and the result is stunning. Worth every penny.",
    date: '2025-09-15',
    verified: true,
    responded: true,
    responseDate: '2025-09-16',
    responseContent: "David, we're thrilled you love your new patio! The AI design tool really helps bring visions to life. Enjoy many years of outdoor entertaining!",
    featured: true,
    sentiment: 'positive',
    themes: ['ai-tool', 'design', 'quality', 'value']
  },
  {
    id: 'rev-005',
    customerName: 'Patricia W.',
    locationSlug: 'reynoldsburg-oh',
    serviceIds: ['leaf-removal'],
    platform: 'facebook',
    rating: 5,
    content: "Called on a Tuesday, they were here Thursday. Quick, efficient, and thorough. All leaves gone, gutters cleaned out too. Fair price. Will call again next fall.",
    date: '2025-11-10',
    verified: true,
    responded: true,
    responseDate: '2025-11-11',
    responseContent: "Thanks Patricia! Fall cleanup is one of our busiest times - glad we could fit you in quickly. We'll reach out next September to get you on the schedule early!",
    featured: false,
    sentiment: 'positive',
    themes: ['quick-response', 'efficiency', 'thoroughness', 'value']
  },
  {
    id: 'rev-006',
    customerName: 'Robert H.',
    locationSlug: 'pataskala-oh',
    serviceIds: ['snow-removal'],
    platform: 'google',
    rating: 5,
    title: 'Best snow service ever',
    content: "First year using them for snow removal. They were at my house by 5am after the first big storm. Driveway was completely clear before I needed to leave for work. Priority service is worth it.",
    date: '2025-12-22',
    verified: true,
    responded: true,
    responseDate: '2025-12-23',
    responseContent: "Robert, that's why we offer priority contracts! Early morning clearing so you never miss work. Stay safe this winter!",
    featured: false,
    sentiment: 'positive',
    themes: ['reliability', 'early-response', 'priority-service']
  },
  {
    id: 'rev-007',
    customerName: 'Amanda L.',
    locationSlug: 'new-albany-oh',
    serviceIds: ['landscaping', 'outdoor-lighting'],
    platform: 'google',
    rating: 5,
    title: 'Complete backyard transformation',
    content: "Grandpa Ron's did our entire backyard - new plantings, mulch, and landscape lighting. The lighting especially makes such a difference at night. Very professional team and Ron himself checked in multiple times during the project.",
    date: '2025-08-30',
    verified: true,
    responded: true,
    responseDate: '2025-08-31',
    responseContent: "Amanda, your backyard is truly a showpiece now! The lighting really does transform a space. Thank you for trusting us with such a significant project.",
    featured: true,
    sentiment: 'positive',
    themes: ['quality', 'personal-service', 'transformation', 'professionalism']
  },
  {
    id: 'rev-008',
    customerName: 'Tom G.',
    locationSlug: 'westerville-oh',
    serviceIds: ['overseeding'],
    platform: 'angi',
    rating: 5,
    content: "Did aeration and overseeding in September. By spring my lawn was the greenest on the block. Very knowledgeable about the best seed types for our area.",
    date: '2025-05-15',
    verified: true,
    responded: true,
    responseDate: '2025-05-16',
    responseContent: "Tom, fall is definitely the best time for overseeding in Central Ohio! Glad your lawn is thriving. Remember to keep up with your mowing height this summer.",
    featured: false,
    sentiment: 'positive',
    themes: ['expertise', 'results', 'local-knowledge']
  },

  // Good reviews (4 stars)
  {
    id: 'rev-009',
    customerName: 'Carol B.',
    locationSlug: 'gahanna-oh',
    serviceIds: ['mulching'],
    platform: 'google',
    rating: 4,
    content: "Good work overall. The mulching looks great. Only reason for 4 stars is they were about an hour late, but they did text to let us know. Would use again.",
    date: '2025-06-20',
    verified: true,
    responded: true,
    responseDate: '2025-06-21',
    responseContent: "Carol, thank you for understanding about the delay - unexpected traffic that day. We're glad you're happy with the mulching! We'll be sure to build in extra time next visit.",
    featured: false,
    sentiment: 'positive',
    themes: ['quality', 'communication'],
    photos: []
  },
  {
    id: 'rev-010',
    customerName: 'Steve M.',
    locationSlug: 'grove-city-oh',
    serviceIds: ['mowing'],
    platform: 'nextdoor',
    rating: 4,
    content: "Weekly mowing service is consistent and the lawn looks good. Would like if they trimmed closer to the fence line but otherwise no complaints. Fair pricing.",
    date: '2025-07-10',
    verified: true,
    responded: true,
    responseDate: '2025-07-11',
    responseContent: "Steve, thanks for the feedback! We've made a note to pay extra attention to your fence line. Your satisfaction is our priority.",
    featured: false,
    sentiment: 'positive',
    themes: ['consistency', 'value']
  },

  // Neutral review
  {
    id: 'rev-011',
    customerName: 'Linda P.',
    locationSlug: 'columbus-oh',
    serviceIds: ['landscaping'],
    platform: 'yelp',
    rating: 3,
    content: "Work was fine but took longer than quoted. Final result looks good but the project went two days over. Communication could have been better during the delays.",
    date: '2025-04-15',
    verified: true,
    responded: true,
    responseDate: '2025-04-16',
    responseContent: "Linda, we apologize for the delays and communication gaps. We've since implemented daily update texts for all multi-day projects. We hope you're enjoying your new landscape and would welcome the opportunity to serve you again.",
    featured: false,
    sentiment: 'neutral',
    themes: ['timeline', 'communication']
  }
];

// ============================================
// REVIEW REGISTRY CLASS
// ============================================

class ReviewRegistry {
  private reviews: Review[];

  constructor() {
    this.reviews = reviews;
  }

  /**
   * Get all reviews
   */
  getAllReviews(): Review[] {
    return this.reviews;
  }

  /**
   * Get review by ID
   */
  getReviewById(id: string): Review | undefined {
    return this.reviews.find(r => r.id === id);
  }

  /**
   * Get reviews by platform
   */
  getReviewsByPlatform(platform: Review['platform']): Review[] {
    return this.reviews.filter(r => r.platform === platform);
  }

  /**
   * Get reviews by location
   */
  getReviewsByLocation(locationSlug: string): Review[] {
    return this.reviews.filter(r => r.locationSlug === locationSlug);
  }

  /**
   * Get reviews by service
   */
  getReviewsByService(serviceId: string): Review[] {
    return this.reviews.filter(r => r.serviceIds.includes(serviceId));
  }

  /**
   * Get featured reviews for display
   */
  getFeaturedReviews(): Review[] {
    return this.reviews.filter(r => r.featured && r.rating >= 4);
  }

  /**
   * Get reviews by rating
   */
  getReviewsByRating(rating: 1 | 2 | 3 | 4 | 5): Review[] {
    return this.reviews.filter(r => r.rating === rating);
  }

  /**
   * Get positive reviews (4-5 stars)
   */
  getPositiveReviews(): Review[] {
    return this.reviews.filter(r => r.rating >= 4);
  }

  /**
   * Get reviews needing response
   */
  getUnrespondedReviews(): Review[] {
    return this.reviews.filter(r => !r.responded);
  }

  /**
   * Get recent reviews (last 30 days)
   */
  getRecentReviews(days: number = 30): Review[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return this.reviews
      .filter(r => r.date >= cutoffStr)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  /**
   * Calculate average rating
   */
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  /**
   * Get rating distribution
   */
  getRatingDistribution(): Record<1 | 2 | 3 | 4 | 5, number> {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    this.reviews.forEach(r => {
      distribution[r.rating]++;
    });

    return distribution;
  }

  /**
   * Get comprehensive review summary
   */
  getSummary(): ReviewSummary {
    const distribution = this.getRatingDistribution();

    // Platform breakdown
    const platformBreakdown: Record<string, { count: number; avgRating: number }> = {};
    const platforms = ['google', 'facebook', 'nextdoor', 'yelp', 'angi', 'internal'];

    platforms.forEach(platform => {
      const platformReviews = this.getReviewsByPlatform(platform as Review['platform']);
      if (platformReviews.length > 0) {
        platformBreakdown[platform] = {
          count: platformReviews.length,
          avgRating: Math.round(
            (platformReviews.reduce((sum, r) => sum + r.rating, 0) / platformReviews.length) * 10
          ) / 10
        };
      }
    });

    // Theme analysis
    const themeCount: Record<string, { positive: number; negative: number }> = {};
    this.reviews.forEach(r => {
      r.themes.forEach(theme => {
        if (!themeCount[theme]) {
          themeCount[theme] = { positive: 0, negative: 0 };
        }
        if (r.sentiment === 'positive') {
          themeCount[theme].positive++;
        } else if (r.sentiment === 'negative') {
          themeCount[theme].negative++;
        }
      });
    });

    const commonThemes = Object.entries(themeCount)
      .map(([theme, counts]) => ({
        theme,
        count: counts.positive + counts.negative,
        sentiment: counts.positive >= counts.negative ? 'positive' : 'negative' as const
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Trend analysis (compare last 3 months to prior 3 months)
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    const recentReviews = this.reviews.filter(r =>
      new Date(r.date) >= threeMonthsAgo
    );
    const priorReviews = this.reviews.filter(r =>
      new Date(r.date) >= sixMonthsAgo && new Date(r.date) < threeMonthsAgo
    );

    const recentAvg = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
      : 0;
    const priorAvg = priorReviews.length > 0
      ? priorReviews.reduce((sum, r) => sum + r.rating, 0) / priorReviews.length
      : 0;

    let recentTrend: 'improving' | 'stable' | 'declining';
    if (recentAvg > priorAvg + 0.2) {
      recentTrend = 'improving';
    } else if (recentAvg < priorAvg - 0.2) {
      recentTrend = 'declining';
    } else {
      recentTrend = 'stable';
    }

    // Response rate
    const respondedCount = this.reviews.filter(r => r.responded).length;
    const responseRate = Math.round((respondedCount / this.reviews.length) * 100);

    return {
      totalReviews: this.reviews.length,
      averageRating: this.getAverageRating(),
      ratingDistribution: distribution,
      platformBreakdown,
      recentTrend,
      responseRate,
      commonThemes
    };
  }

  /**
   * Get testimonials for a specific service (for service pages)
   */
  getServiceTestimonials(serviceId: string, limit: number = 3): Review[] {
    return this.reviews
      .filter(r =>
        r.serviceIds.includes(serviceId) &&
        r.rating >= 4 &&
        r.content.length > 50
      )
      .sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
      .slice(0, limit);
  }

  /**
   * Get location testimonials (for location pages)
   */
  getLocationTestimonials(locationSlug: string, limit: number = 3): Review[] {
    return this.reviews
      .filter(r =>
        r.locationSlug === locationSlug &&
        r.rating >= 4 &&
        r.content.length > 50
      )
      .sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
      .slice(0, limit);
  }

  /**
   * Generate JSON-LD for reviews (for SEO)
   */
  generateReviewSchema(): object {
    const summary = this.getSummary();

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': summary.averageRating.toString(),
        'reviewCount': summary.totalReviews.toString(),
        'bestRating': '5',
        'worstRating': '1'
      },
      'review': this.getFeaturedReviews().slice(0, 5).map(r => ({
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': r.customerName
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': r.rating.toString(),
          'bestRating': '5',
          'worstRating': '1'
        },
        'reviewBody': r.content,
        'datePublished': r.date
      }))
    };
  }
}

export const reviewRegistry = new ReviewRegistry();
