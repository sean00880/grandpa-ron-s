/**
 * COMPETITOR REGISTRY
 * Competitive intelligence for market dominance in Columbus, Ohio
 *
 * Purpose: Track competitors to inform pricing, marketing, and service offerings
 * Usage: Strategic planning, SEO gap analysis, differentiation strategy
 */

export interface Competitor {
  id: string;
  name: string;
  type: 'national' | 'regional' | 'local' | 'franchise';
  website?: string;
  phone?: string;
  googlePlaceId?: string;
  serviceAreas: string[]; // location slugs from locationRegistry
  services: string[]; // service slugs from serviceRegistry
  pricePositioning: 'budget' | 'value' | 'mid-market' | 'premium';
  estimatedPriceRange?: {
    mowing: { min: number; max: number };
    mulching: { min: number; max: number };
  };
  rating?: number;
  reviewCount?: number;
  yearEstablished?: number;
  employeeCount?: string;
  strengths: string[];
  weaknesses: string[];
  marketingChannels: string[];
  notes: string;
  lastUpdated: string;
}

const competitors: Competitor[] = [
  // National Chains
  {
    id: 'trugreen',
    name: 'TruGreen',
    type: 'national',
    website: 'https://www.trugreen.com',
    pricePositioning: 'value',
    services: ['lawn-mowing', 'fertilization', 'weed-control', 'aeration', 'overseeding'],
    serviceAreas: ['columbus-oh', 'grove-city-oh', 'westerville-oh', 'gahanna-oh', 'upper-arlington-oh'],
    rating: 3.8,
    reviewCount: 2500,
    yearEstablished: 1973,
    employeeCount: '10,000+',
    strengths: [
      'National brand recognition',
      'Aggressive marketing budget',
      'Subscription model lock-in',
      'Scientific lawn care approach'
    ],
    weaknesses: [
      'Impersonal service',
      'High employee turnover',
      'Cookie-cutter approach',
      'Upselling complaints',
      'No hardscaping services'
    ],
    marketingChannels: ['TV', 'Radio', 'Direct Mail', 'Google Ads', 'Door Hangers'],
    notes: 'Primary competitor for lawn treatment services. Vulnerable on personal service angle.',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'lawn-doctor',
    name: 'Lawn Doctor',
    type: 'franchise',
    website: 'https://www.lawndoctor.com',
    pricePositioning: 'mid-market',
    services: ['lawn-mowing', 'fertilization', 'weed-control', 'mosquito-control'],
    serviceAreas: ['columbus-oh', 'pickerington-oh', 'reynoldsburg-oh'],
    rating: 4.2,
    reviewCount: 180,
    yearEstablished: 1967,
    strengths: [
      'Franchise model with local operators',
      'Strong brand in lawn treatment',
      'Proprietary equipment'
    ],
    weaknesses: [
      'Limited service offerings',
      'Premium pricing for basic services',
      'No landscaping or hardscaping'
    ],
    marketingChannels: ['Google Ads', 'Direct Mail', 'Referral Program'],
    notes: 'Franchise model means varying quality. Local franchise less aggressive.',
    lastUpdated: '2026-01-01'
  },

  // Regional Competitors
  {
    id: 'greenscapes-ohio',
    name: 'GreenScapes Ohio',
    type: 'regional',
    pricePositioning: 'premium',
    services: ['landscaping', 'hardscaping', 'tree-trimming', 'outdoor-lighting'],
    serviceAreas: ['new-albany-oh', 'upper-arlington-oh', 'bexley-oh', 'grandview-heights-oh'],
    rating: 4.7,
    reviewCount: 320,
    yearEstablished: 2008,
    employeeCount: '25-50',
    strengths: [
      'Premium market positioning',
      'High-end design capability',
      'Strong referral network in affluent areas'
    ],
    weaknesses: [
      'High prices exclude mid-market',
      'Long lead times',
      'Limited seasonal services'
    ],
    marketingChannels: ['Houzz', 'Instagram', 'Word of Mouth'],
    notes: 'Not direct competitor for mowing. Target their customers for maintenance after install.',
    lastUpdated: '2026-01-01'
  },

  // Local Competitors
  {
    id: 'ohio-green-lawns',
    name: 'Ohio Green Lawns',
    type: 'local',
    pricePositioning: 'budget',
    services: ['lawn-mowing', 'leaf-removal', 'snow-removal'],
    serviceAreas: ['canal-winchester-oh', 'lithopolis-oh', 'pickerington-oh', 'groveport-oh'],
    rating: 4.4,
    reviewCount: 85,
    yearEstablished: 2015,
    employeeCount: '5-10',
    estimatedPriceRange: {
      mowing: { min: 25, max: 45 },
      mulching: { min: 70, max: 90 }
    },
    strengths: [
      'Low prices',
      'Quick response time',
      'Good for basic services'
    ],
    weaknesses: [
      'Limited services',
      'Quality inconsistency',
      'No design capability',
      'Seasonal availability issues'
    ],
    marketingChannels: ['Facebook', 'Nextdoor', 'Yard Signs'],
    notes: 'Direct competitor in primary service area. Compete on quality and reliability, not price.',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'precision-lawn-care',
    name: 'Precision Lawn Care Columbus',
    type: 'local',
    pricePositioning: 'mid-market',
    services: ['lawn-mowing', 'mulching', 'landscaping', 'snow-removal'],
    serviceAreas: ['reynoldsburg-oh', 'gahanna-oh', 'pataskala-oh', 'blacklick-estates-oh'],
    rating: 4.6,
    reviewCount: 145,
    yearEstablished: 2012,
    employeeCount: '10-20',
    estimatedPriceRange: {
      mowing: { min: 35, max: 55 },
      mulching: { min: 80, max: 100 }
    },
    strengths: [
      'Good reputation',
      'Reliable scheduling',
      'Professional appearance'
    ],
    weaknesses: [
      'Slow to adopt technology',
      'No AI or visualization tools',
      'Limited geographic range'
    ],
    marketingChannels: ['Google Business', 'Angi', 'HomeAdvisor'],
    notes: 'Solid competitor. Differentiate with AI tools and family story.',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'bobs-landscaping',
    name: "Bob's Landscaping & Tree Service",
    type: 'local',
    pricePositioning: 'budget',
    services: ['tree-trimming', 'tree-removal', 'landscaping', 'mulching'],
    serviceAreas: ['lancaster-oh', 'baltimore-oh', 'ashville-oh', 'circleville-oh'],
    rating: 4.3,
    reviewCount: 62,
    yearEstablished: 2005,
    employeeCount: '5-10',
    strengths: [
      'Tree service expertise',
      'Serves rural areas',
      'Competitive pricing'
    ],
    weaknesses: [
      'Outdated equipment',
      'Limited online presence',
      'Inconsistent availability'
    ],
    marketingChannels: ['Word of Mouth', 'Local Newspaper'],
    notes: 'Primary tree service competitor in southern service area.',
    lastUpdated: '2026-01-01'
  }
];

// ============================================
// COMPETITOR REGISTRY CLASS
// ============================================

class CompetitorRegistry {
  private competitors: Competitor[];

  constructor() {
    this.competitors = competitors;
  }

  getAllCompetitors(): Competitor[] {
    return this.competitors;
  }

  getCompetitorById(id: string): Competitor | undefined {
    return this.competitors.find(c => c.id === id);
  }

  getCompetitorsByType(type: Competitor['type']): Competitor[] {
    return this.competitors.filter(c => c.type === type);
  }

  getCompetitorsByLocation(locationSlug: string): Competitor[] {
    return this.competitors.filter(c =>
      c.serviceAreas.includes(locationSlug)
    );
  }

  getCompetitorsByService(serviceSlug: string): Competitor[] {
    return this.competitors.filter(c =>
      c.services.includes(serviceSlug)
    );
  }

  getCompetitorsByPricing(positioning: Competitor['pricePositioning']): Competitor[] {
    return this.competitors.filter(c => c.pricePositioning === positioning);
  }

  /**
   * Get competitors with higher ratings that we should watch
   */
  getTopRatedCompetitors(minRating: number = 4.5): Competitor[] {
    return this.competitors
      .filter(c => (c.rating || 0) >= minRating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  /**
   * Analyze competitive gaps for a service in a location
   */
  analyzeGaps(locationSlug: string, serviceSlug: string): {
    competitors: Competitor[];
    opportunityLevel: 'high' | 'medium' | 'low';
    recommendation: string;
  } {
    const locationCompetitors = this.getCompetitorsByLocation(locationSlug);
    const serviceCompetitors = locationCompetitors.filter(c =>
      c.services.includes(serviceSlug)
    );

    let opportunityLevel: 'high' | 'medium' | 'low';
    let recommendation: string;

    if (serviceCompetitors.length === 0) {
      opportunityLevel = 'high';
      recommendation = `No competitors offering ${serviceSlug} in this location. Strong market entry opportunity.`;
    } else if (serviceCompetitors.length <= 2) {
      opportunityLevel = 'medium';
      recommendation = `Limited competition (${serviceCompetitors.length} providers). Differentiate on quality and service.`;
    } else {
      opportunityLevel = 'low';
      recommendation = `Competitive market (${serviceCompetitors.length} providers). Focus on unique value props like AI tools.`;
    }

    return {
      competitors: serviceCompetitors,
      opportunityLevel,
      recommendation
    };
  }

  /**
   * Get SWOT analysis summary
   */
  getSWOTSummary(): {
    theirStrengths: string[];
    theirWeaknesses: string[];
    ourOpportunities: string[];
    ourThreats: string[];
  } {
    const allStrengths = this.competitors.flatMap(c => c.strengths);
    const allWeaknesses = this.competitors.flatMap(c => c.weaknesses);

    return {
      theirStrengths: [...new Set(allStrengths)].slice(0, 10),
      theirWeaknesses: [...new Set(allWeaknesses)].slice(0, 10),
      ourOpportunities: [
        'AI-powered visualization (unique in market)',
        'Family brand story vs corporate competitors',
        'Property audit tool (no competitors have this)',
        'Instant quoting capability',
        'Tech-forward image appeals to younger homeowners'
      ],
      ourThreats: [
        'National chains marketing budgets',
        'Price pressure from budget providers',
        'Labor market competition',
        'Economic downturn reducing discretionary spending'
      ]
    };
  }
}

export const competitorRegistry = new CompetitorRegistry();
