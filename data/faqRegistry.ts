/**
 * FAQ Registry - Frequently Asked Questions for programmatic pages
 * Organized by category and linked to services/locations
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'services' | 'scheduling' | 'seasonal';
  serviceSlug?: string;
  locationSlug?: string;
  featured: boolean;
  order: number;
}

const faqs: FAQ[] = [
  // General FAQs
  {
    id: 'service-area',
    question: 'What areas do you serve?',
    answer: 'We serve 24 cities and communities in Central Ohio, primarily within a 20-mile radius of Canal Winchester. This includes Canal Winchester, Columbus, Pickerington, Reynoldsburg, Groveport, Lancaster, Lithopolis, and many more. Visit our Service Areas page to find your location.',
    category: 'general',
    featured: true,
    order: 1,
  },
  {
    id: 'free-estimates',
    question: 'Do you offer free estimates?',
    answer: 'Yes! We provide free, no-obligation estimates for all our services. You can request an estimate through our website, by calling (220) 666-2520, or by using our AI-powered instant quote tool for common services.',
    category: 'general',
    featured: true,
    order: 2,
  },
  {
    id: 'insurance',
    question: 'Are you licensed and insured?',
    answer: 'Absolutely. Grandpa Ron\'s Landscaping is fully licensed and insured, including general liability and workers\' compensation coverage. We\'re happy to provide certificates of insurance upon request.',
    category: 'general',
    featured: true,
    order: 3,
  },
  {
    id: 'same-day-service',
    question: 'Do you offer same-day or emergency service?',
    answer: 'We offer same-day service for snow removal and emergency storm damage cleanup when possible. For other services, we typically schedule within 2-7 days depending on the season and service type.',
    category: 'scheduling',
    featured: false,
    order: 4,
  },

  // Pricing FAQs
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, checks, and all major credit cards. For recurring services, we offer convenient monthly billing. Payment is due upon completion of work unless other arrangements have been made.',
    category: 'pricing',
    featured: true,
    order: 1,
  },
  {
    id: 'pricing-factors',
    question: 'What factors affect your pricing?',
    answer: 'Pricing depends on property size, complexity of the work, accessibility, and material costs. We provide detailed written estimates so you know exactly what to expect. There are no hidden fees or surprise charges.',
    category: 'pricing',
    featured: false,
    order: 2,
  },
  {
    id: 'discounts',
    question: 'Do you offer any discounts?',
    answer: 'Yes! We offer discounts for seniors (65+), veterans, recurring service contracts, and bundled services. We also run seasonal promotions - ask about current offers when you get your estimate.',
    category: 'pricing',
    featured: false,
    order: 3,
  },

  // Mulching FAQs
  {
    id: 'mulch-types',
    question: 'What types of mulch do you offer?',
    answer: 'We offer premium hardwood mulch in natural brown, dyed black, and dyed red. We also offer cedar mulch for pest-deterrent properties. All our mulch is sourced from reputable local suppliers.',
    category: 'services',
    serviceSlug: 'mulching',
    featured: true,
    order: 1,
  },
  {
    id: 'mulch-depth',
    question: 'How deep should mulch be applied?',
    answer: 'We recommend 2-4 inches of mulch for most applications. Thinner applications (2 inches) work well for annual refreshes, while 3-4 inches is ideal for new beds or areas with heavy weed pressure. We never pile mulch against tree trunks or plant stems.',
    category: 'services',
    serviceSlug: 'mulching',
    featured: false,
    order: 2,
  },
  {
    id: 'mulch-timing',
    question: 'When is the best time to mulch?',
    answer: 'Spring (April-May) is the most popular time to mulch as it prepares beds for the growing season. Fall mulching (October-November) helps protect plants through winter. We recommend annual mulch refreshes to maintain the benefits.',
    category: 'services',
    serviceSlug: 'mulching',
    featured: false,
    order: 3,
  },

  // Mowing FAQs
  {
    id: 'mowing-frequency',
    question: 'How often should I have my lawn mowed?',
    answer: 'During the growing season (April-October), we recommend weekly mowing for optimal lawn health. Bi-weekly service works for slower-growing lawns or those with irrigation. We adjust frequency based on grass growth rate and weather conditions.',
    category: 'services',
    serviceSlug: 'lawn-mowing',
    featured: true,
    order: 1,
  },
  {
    id: 'mowing-height',
    question: 'What height do you cut grass?',
    answer: 'We follow the "one-third rule" - never removing more than one-third of the grass blade at once. For cool-season grasses common in Ohio, we typically maintain 3-3.5 inch heights in spring/fall and 3.5-4 inches in summer to help grass cope with heat stress.',
    category: 'services',
    serviceSlug: 'lawn-mowing',
    featured: false,
    order: 2,
  },
  {
    id: 'mowing-wet-grass',
    question: 'Do you mow in the rain?',
    answer: 'We avoid mowing wet grass when possible as it can damage the lawn and equipment. If rain is expected, we may reschedule to the next available day. We always communicate schedule changes promptly.',
    category: 'services',
    serviceSlug: 'lawn-mowing',
    featured: false,
    order: 3,
  },

  // Tree Service FAQs
  {
    id: 'tree-timing',
    question: 'When is the best time to trim trees?',
    answer: 'Most trees can be pruned year-round for deadwood removal. For major pruning, late winter (dormant season) is ideal for most species. Spring-flowering trees should be pruned right after blooming. We can advise on timing for your specific trees.',
    category: 'services',
    serviceSlug: 'tree-trimming',
    featured: true,
    order: 1,
  },
  {
    id: 'tree-permits',
    question: 'Do I need a permit to remove a tree?',
    answer: 'In most Central Ohio communities, you don\'t need a permit to remove trees on your own residential property. However, some cities have ordinances for heritage trees or trees in certain locations. We can help you determine if permits are needed.',
    category: 'services',
    serviceSlug: 'tree-trimming',
    featured: false,
    order: 2,
  },
  {
    id: 'tree-removal-cost',
    question: 'How much does tree removal cost?',
    answer: 'Tree removal costs vary widely based on size, location, and complexity. Small trees may cost $200-$500, while large trees in difficult locations can range from $1,000-$3,000+. We provide free on-site estimates for accurate pricing.',
    category: 'services',
    serviceSlug: 'tree-trimming',
    featured: false,
    order: 3,
  },

  // Snow Removal FAQs
  {
    id: 'snow-triggers',
    question: 'When do you come for snow removal?',
    answer: 'For contract customers, we automatically respond when snowfall reaches 2 inches (or your specified trigger amount). We monitor conditions closely and typically begin service early morning so driveways are clear before you leave for work.',
    category: 'services',
    serviceSlug: 'snow-removal',
    featured: true,
    order: 1,
  },
  {
    id: 'snow-contracts',
    question: 'Do you offer seasonal snow removal contracts?',
    answer: 'Yes! Seasonal contracts guarantee priority service throughout winter for a fixed monthly fee. This gives you peace of mind knowing your property will be cleared regardless of how much it snows. One-time and per-push rates are also available.',
    category: 'services',
    serviceSlug: 'snow-removal',
    featured: false,
    order: 2,
  },
  {
    id: 'ice-melt-safe',
    question: 'Is the ice melt you use safe for pets and plants?',
    answer: 'We use pet-safe and plant-friendly ice melt products. Standard rock salt can harm pets and vegetation, so we only use it in areas where there are no concerns. Let us know your preferences and we\'ll accommodate them.',
    category: 'services',
    serviceSlug: 'snow-removal',
    featured: false,
    order: 3,
  },

  // Hardscaping FAQs
  {
    id: 'paver-types',
    question: 'What types of pavers do you recommend?',
    answer: 'We work with all major paver brands including Belgard, Unilock, and EP Henry. For patios, we recommend concrete pavers for durability and variety. Natural stone is beautiful but costs more. We\'ll help you choose based on aesthetics, use, and budget.',
    category: 'services',
    serviceSlug: 'hardscaping',
    featured: true,
    order: 1,
  },
  {
    id: 'retaining-wall-permits',
    question: 'Do retaining walls require permits?',
    answer: 'In most Ohio communities, walls over 4 feet tall require engineering and permits. Shorter walls typically don\'t need permits but may need to meet setback requirements. We handle permit applications when required.',
    category: 'services',
    serviceSlug: 'hardscaping',
    featured: false,
    order: 2,
  },
  {
    id: 'hardscape-maintenance',
    question: 'How do I maintain my paver patio?',
    answer: 'Pavers are low-maintenance but benefit from occasional sweeping, weed removal from joints, and periodic sealing (every 2-3 years). We offer maintenance services including re-sanding joints and sealing to keep your patio looking new.',
    category: 'services',
    serviceSlug: 'hardscaping',
    featured: false,
    order: 3,
  },

  // Overseeding FAQs
  {
    id: 'overseeding-timing',
    question: 'When is the best time to overseed?',
    answer: 'Fall (late August to mid-October) is the ideal time to overseed in Ohio. Cool temperatures, reliable moisture, and reduced weed pressure give seeds the best chance to establish. Spring overseeding is possible but less reliable.',
    category: 'services',
    serviceSlug: 'overseeding',
    featured: true,
    order: 1,
  },
  {
    id: 'seed-types',
    question: 'What type of grass seed do you use?',
    answer: 'We use premium seed blends suited to Central Ohio\'s climate, typically featuring Turf-Type Tall Fescue, Kentucky Bluegrass, and Perennial Ryegrass. We select varieties for disease resistance, drought tolerance, and appearance.',
    category: 'services',
    serviceSlug: 'overseeding',
    featured: false,
    order: 2,
  },
  {
    id: 'watering-after-seeding',
    question: 'How should I water after overseeding?',
    answer: 'Keep the seeded areas consistently moist (not soaking wet) for 2-3 weeks until germination. Water lightly 2-3 times daily for short periods. After germination, gradually transition to deeper, less frequent watering. We\'ll provide detailed care instructions.',
    category: 'services',
    serviceSlug: 'overseeding',
    featured: false,
    order: 3,
  },

  // Scheduling FAQs
  {
    id: 'scheduling-recurring',
    question: 'How do I set up recurring service?',
    answer: 'Simply contact us to discuss your needs. We\'ll evaluate your property, recommend a service schedule, and set up your recurring plan. Most customers prefer weekly mowing during growing season with seasonal cleanups included.',
    category: 'scheduling',
    featured: true,
    order: 1,
  },
  {
    id: 'cancellation-policy',
    question: 'What is your cancellation policy?',
    answer: 'We understand plans change. Please give us 24 hours notice to cancel or reschedule without charge. For recurring services, we ask for 2 weeks notice to end service. Weather-related rescheduling is handled automatically.',
    category: 'scheduling',
    featured: false,
    order: 2,
  },

  // Landscaping FAQs
  {
    id: 'landscaping-cost',
    question: 'How much does landscaping cost?',
    answer: 'Landscaping costs vary widely based on scope. Small projects like foundation planting updates may run $500-$2,000. Full landscape renovations typically range from $5,000-$25,000+. We provide detailed written estimates broken down by materials and labor.',
    category: 'services',
    serviceSlug: 'landscaping',
    featured: true,
    order: 1,
  },
  {
    id: 'landscaping-timeline',
    question: 'How long does a landscaping project take?',
    answer: 'Timeline depends on project scope. Small projects may complete in 1-2 days. Larger projects typically take 1-2 weeks. Hardscape additions or major renovations may require 2-4 weeks. We provide timeline estimates with your quote.',
    category: 'services',
    serviceSlug: 'landscaping',
    featured: false,
    order: 2,
  },
  {
    id: 'plant-selection',
    question: 'How do you choose plants for my landscape?',
    answer: 'We select plants based on your site conditions (sun, shade, soil, drainage), your aesthetic preferences, maintenance level desired, and budget. We emphasize plants proven to thrive in Central Ohio and often incorporate native species.',
    category: 'services',
    serviceSlug: 'landscaping',
    featured: false,
    order: 3,
  },
];

// ============================================
// FAQ REGISTRY CLASS
// ============================================

class FAQRegistry {
  private faqs: FAQ[];

  constructor() {
    this.faqs = faqs;
  }

  getAllFAQs(): FAQ[] {
    return this.faqs.sort((a, b) => a.order - b.order);
  }

  getFAQById(id: string): FAQ | undefined {
    return this.faqs.find(f => f.id === id);
  }

  getFeaturedFAQs(): FAQ[] {
    return this.faqs.filter(f => f.featured).sort((a, b) => a.order - b.order);
  }

  getFAQsByCategory(category: FAQ['category']): FAQ[] {
    return this.faqs.filter(f => f.category === category).sort((a, b) => a.order - b.order);
  }

  getFAQsByService(serviceSlug: string): FAQ[] {
    return this.faqs.filter(f => f.serviceSlug === serviceSlug).sort((a, b) => a.order - b.order);
  }

  getFAQsByLocation(locationSlug: string): FAQ[] {
    // Return general FAQs plus any location-specific ones
    return this.faqs.filter(f =>
      !f.locationSlug || f.locationSlug === locationSlug
    ).sort((a, b) => a.order - b.order);
  }

  getCategories(): FAQ['category'][] {
    return [...new Set(this.faqs.map(f => f.category))];
  }

  searchFAQs(query: string): FAQ[] {
    const q = query.toLowerCase();
    return this.faqs.filter(f =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  }

  /**
   * Get FAQ JSON-LD for SEO
   */
  getJSONLD(faqIds?: string[]): object {
    const selectedFaqs = faqIds
      ? this.faqs.filter(f => faqIds.includes(f.id))
      : this.getFeaturedFAQs();

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': selectedFaqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer,
        },
      })),
    };
  }
}

export const faqRegistry = new FAQRegistry();
