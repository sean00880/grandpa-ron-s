/**
 * Service Registry - Rich service data for programmatic pages
 * Expands on pricingRegistry with full service descriptions, SEO data, and features
 */

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  icon: string; // Lucide icon name
  heroImage: string;
  galleryImages: string[];
  category: 'lawn-care' | 'landscaping' | 'tree-services' | 'seasonal' | 'hardscaping' | 'specialty';
  pricing: {
    basePrice: number;
    unit: string;
    variablePricing: boolean;
    priceRange?: string;
  };
  pricingId: string; // Reference to pricingRegistry
  equipment: string[];
  certifications: string[];
  availability: {
    seasonal: boolean;
    seasons?: ('spring' | 'summer' | 'fall' | 'winter')[];
    leadTime: string;
  };
  locations: 'all' | string[]; // 'all' or specific location slugs
  featured: boolean;
  seoKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  faqIds: string[];
  relatedServiceIds: string[];
}

const services: Service[] = [
  {
    id: 'mulching',
    name: 'Mulching Services',
    slug: 'mulching',
    shortDescription: 'Commercial and residential mulching services to enhance your landscape.',
    longDescription: `Transform your garden beds and landscape with our premium mulching services. We use high-quality hardwood mulch that not only enhances the appearance of your property but also provides essential benefits for your plants. Our mulching services help retain soil moisture, regulate soil temperature, suppress weed growth, and add vital nutrients as the mulch decomposes. Whether you need a full property refresh or targeted bed treatments, Grandpa Ron's delivers professional results that last.`,
    features: [
      'Premium hardwood mulch options',
      'Color-matched mulch selection',
      'Old mulch removal available',
      'Precise depth application (2-4 inches)',
      'Edging and bed preparation included',
      'Same-week scheduling available',
    ],
    benefits: [
      'Reduces watering needs by up to 50%',
      'Prevents weed growth naturally',
      'Protects plant roots from temperature extremes',
      'Enhances curb appeal instantly',
      'Adds organic matter as it decomposes',
    ],
    icon: 'Shovel',
    heroImage: '/img/IMG_1942.JPG',
    galleryImages: ['/img/IMG_1942.JPG', '/img/IMG_1943.JPG', '/img/IMG_1955.JPG', '/img/IMG_1956.JPG', '/img/IMG_1965.JPG', '/img/IMG_1978.JPG', '/img/IMG_1984.JPG'],
    category: 'landscaping',
    pricing: {
      basePrice: 85.00,
      unit: 'cubic yard',
      variablePricing: true,
      priceRange: '$85-$110 per cubic yard',
    },
    pricingId: 'mulch',
    equipment: ['Mulch spreader', 'Wheelbarrows', 'Edging tools', 'Delivery truck'],
    certifications: [],
    availability: {
      seasonal: true,
      seasons: ['spring', 'summer', 'fall'],
      leadTime: '2-5 days',
    },
    locations: 'all',
    featured: true,
    seoKeywords: ['mulching services', 'hardwood mulch', 'garden bed mulch', 'landscape mulching', 'mulch delivery and installation'],
    metaTitle: 'Professional Mulching Services | Grandpa Ron\'s Landscaping',
    metaDescription: 'Premium hardwood mulching services in Central Ohio. Enhance your landscape, reduce weeds, and protect your plants. Free estimates available.',
    faqIds: ['mulch-types', 'mulch-depth', 'mulch-timing'],
    relatedServiceIds: ['landscaping', 'garden-bed-cleanup', 'planting'],
  },
  {
    id: 'mowing',
    name: 'Lawn Mowing',
    slug: 'lawn-mowing',
    shortDescription: 'Regular lawn maintenance for commercial and residential properties.',
    longDescription: `Keep your lawn looking pristine with Grandpa Ron's professional mowing services. We provide precision cutting tailored to your grass type and season, ensuring optimal lawn health and appearance. Our team uses commercial-grade equipment maintained to the highest standards, delivering clean cuts without tearing or damaging your turf. From weekly residential maintenance to large commercial properties, we've got you covered.`,
    features: [
      'Weekly, bi-weekly, or custom schedules',
      'Commercial-grade mowing equipment',
      'Optimized cutting heights by season',
      'Stripe patterns available',
      'Clipping bagging or mulching options',
      'Edging and blowing included',
    ],
    benefits: [
      'Consistent professional appearance',
      'Promotes thicker, healthier grass',
      'Prevents pest and disease issues',
      'Saves you valuable time',
      'Increases property value',
    ],
    icon: 'Scissors',
    heroImage: '/img/IMG_1936.JPG',
    galleryImages: ['/img/IMG_1936.JPG', '/img/IMG_1938.JPG', '/img/IMG_1946.JPG', '/img/IMG_1949.JPG', '/img/IMG_1960.JPG', '/img/IMG_1971.JPG', '/img/IMG_1981.JPG'],
    category: 'lawn-care',
    pricing: {
      basePrice: 60.00,
      unit: 'acre',
      variablePricing: true,
      priceRange: '$35-$75 per visit',
    },
    pricingId: 'mow',
    equipment: ['Commercial zero-turn mowers', 'Walk-behind mowers', 'String trimmers', 'Blowers'],
    certifications: [],
    availability: {
      seasonal: true,
      seasons: ['spring', 'summer', 'fall'],
      leadTime: '1-3 days',
    },
    locations: 'all',
    featured: true,
    seoKeywords: ['lawn mowing', 'grass cutting', 'lawn maintenance', 'yard mowing service', 'residential mowing'],
    metaTitle: 'Professional Lawn Mowing Services | Grandpa Ron\'s',
    metaDescription: 'Reliable weekly lawn mowing services in Central Ohio. Commercial-grade equipment, competitive pricing. Get a free quote today!',
    faqIds: ['mowing-frequency', 'mowing-height', 'mowing-wet-grass'],
    relatedServiceIds: ['overseeding', 'lawn-treatments', 'edging'],
  },
  {
    id: 'tree-trimming',
    name: 'Tree Trimming & Pruning',
    slug: 'tree-trimming',
    shortDescription: 'View enhancement pruning, structural pruning, and complete tree removal.',
    longDescription: `Professional tree care is essential for the health, safety, and beauty of your property. Grandpa Ron's tree trimming and pruning services range from light maintenance to complete tree removal. Our experienced crew understands proper pruning techniques that promote tree health while enhancing your property's appearance and safety. We handle everything from small ornamental trees to large shade trees.`,
    features: [
      'Crown thinning and shaping',
      'Deadwood removal',
      'View enhancement pruning',
      'Storm damage cleanup',
      'Complete tree removal',
      'Stump grinding available',
    ],
    benefits: [
      'Improves tree health and longevity',
      'Reduces storm damage risk',
      'Enhances property views',
      'Increases light penetration',
      'Prevents hazardous limb falls',
    ],
    icon: 'Trees',
    heroImage: '/img/IMG_1939.JPG',
    galleryImages: ['/img/IMG_1939.JPG', '/img/IMG_1941.JPG', '/img/IMG_1950.JPG', '/img/IMG_1951.JPG', '/img/IMG_1962.JPG', '/img/IMG_1964.JPG', '/img/IMG_1977.JPG', '/img/IMG_1983.JPG'],
    category: 'tree-services',
    pricing: {
      basePrice: 150.00,
      unit: 'per tree',
      variablePricing: true,
      priceRange: '$150-$1,500+ per tree',
    },
    pricingId: 'tree_trim',
    equipment: ['Chainsaws', 'Pole saws', 'Bucket truck', 'Chipper', 'Safety harnesses'],
    certifications: ['ISA Certified Arborist (pending)'],
    availability: {
      seasonal: false,
      leadTime: '3-7 days',
    },
    locations: 'all',
    featured: true,
    seoKeywords: ['tree trimming', 'tree pruning', 'tree removal', 'tree service', 'arborist services'],
    metaTitle: 'Tree Trimming & Removal Services | Grandpa Ron\'s',
    metaDescription: 'Expert tree trimming, pruning, and removal in Central Ohio. Safe, professional service with full cleanup. Free estimates!',
    faqIds: ['tree-timing', 'tree-permits', 'tree-removal-cost'],
    relatedServiceIds: ['storm-damage', 'stump-grinding', 'landscaping'],
  },
  {
    id: 'landscaping',
    name: 'Landscaping Design & Installation',
    slug: 'landscaping',
    shortDescription: 'Complete landscape design and installation services.',
    longDescription: `Transform your outdoor space with Grandpa Ron's comprehensive landscaping services. From initial design consultation to final installation, we create beautiful, functional landscapes that complement your home and lifestyle. Our team works with you to select plants, materials, and features that thrive in Central Ohio's climate while matching your aesthetic preferences and budget.`,
    features: [
      'Custom landscape design',
      'Plant selection guidance',
      'Soil preparation and amendments',
      'Installation of trees, shrubs, and perennials',
      'Drainage solutions',
      'Irrigation system installation',
    ],
    benefits: [
      'Increases property value by 15-20%',
      'Creates outdoor living spaces',
      'Reduces maintenance over time',
      'Improves energy efficiency',
      'Enhances curb appeal',
    ],
    icon: 'Flower2',
    heroImage: '/img/IMG_1933.JPG',
    galleryImages: ['/img/IMG_1933.JPG', '/img/IMG_1934.JPG', '/img/IMG_1944.JPG', '/img/IMG_1945.JPG', '/img/IMG_1958.JPG', '/img/IMG_1959.JPG', '/img/IMG_1968.JPG', '/img/IMG_1974.JPG', '/img/IMG_1975.JPG', '/img/IMG_1979.JPG', '/img/IMG_1982.JPG', '/img/IMG_1985.JPG', '/img/IMG_1986.jpg'],
    category: 'landscaping',
    pricing: {
      basePrice: 500.00,
      unit: 'project',
      variablePricing: true,
      priceRange: '$500-$25,000+ per project',
    },
    pricingId: 'planting',
    equipment: ['Skid steer', 'Mini excavator', 'Tillers', 'Hand tools', 'Delivery vehicles'],
    certifications: [],
    availability: {
      seasonal: true,
      seasons: ['spring', 'summer', 'fall'],
      leadTime: '1-2 weeks',
    },
    locations: 'all',
    featured: true,
    seoKeywords: ['landscaping', 'landscape design', 'landscape installation', 'garden design', 'outdoor living'],
    metaTitle: 'Professional Landscaping Services | Grandpa Ron\'s',
    metaDescription: 'Custom landscape design and installation in Central Ohio. Transform your property with our expert landscaping services. Free consultations!',
    faqIds: ['landscaping-cost', 'landscaping-timeline', 'plant-selection'],
    relatedServiceIds: ['mulching', 'planting', 'hardscaping'],
  },
  {
    id: 'leaf-removal',
    name: 'Leaf & Debris Removal',
    slug: 'leaf-removal',
    shortDescription: 'Fall cleanup services and general debris removal.',
    longDescription: `Don't let fallen leaves smother your lawn and create a breeding ground for pests and disease. Grandpa Ron's leaf removal services ensure your property stays clean and healthy throughout the fall season and beyond. We offer one-time cleanups, weekly fall service, and final winterization cleanups to prepare your lawn for the cold months ahead.`,
    features: [
      'Complete leaf removal',
      'Garden bed cleanup',
      'Gutter cleaning',
      'Final fall cleanup service',
      'Debris hauling',
      'Composting available',
    ],
    benefits: [
      'Prevents lawn disease',
      'Eliminates pest habitats',
      'Prepares lawn for winter',
      'Maintains curb appeal',
      'Protects hardscape surfaces',
    ],
    icon: 'Leaf',
    heroImage: '/img/IMG_1949.JPG',
    galleryImages: ['/img/IMG_1949.JPG', '/img/IMG_1971.JPG'],
    category: 'seasonal',
    pricing: {
      basePrice: 75.00,
      unit: 'per hour',
      variablePricing: true,
      priceRange: '$150-$500 per cleanup',
    },
    pricingId: 'cleaning',
    equipment: ['Backpack blowers', 'Walk-behind blowers', 'Trailer-mounted vacuums', 'Tarps'],
    certifications: [],
    availability: {
      seasonal: true,
      seasons: ['fall'],
      leadTime: '1-3 days',
    },
    locations: 'all',
    featured: false,
    seoKeywords: ['leaf removal', 'fall cleanup', 'yard cleanup', 'leaf collection', 'debris removal'],
    metaTitle: 'Leaf Removal & Fall Cleanup Services | Grandpa Ron\'s',
    metaDescription: 'Professional leaf removal and fall cleanup in Central Ohio. Keep your lawn healthy through winter. Schedule your cleanup today!',
    faqIds: ['leaf-timing', 'leaf-disposal'],
    relatedServiceIds: ['gutter-cleaning', 'lawn-mowing', 'garden-bed-cleanup'],
  },
  {
    id: 'snow-removal',
    name: 'Snow & Ice Management',
    slug: 'snow-removal',
    shortDescription: 'Winter services including snow removal and ice management.',
    longDescription: `Stay safe and accessible during Central Ohio's harsh winters with Grandpa Ron's snow and ice management services. We offer residential driveway clearing, commercial lot plowing, sidewalk shoveling, and ice treatment services. Our team monitors weather conditions closely to provide proactive service when you need it most.`,
    features: [
      'Residential driveway plowing',
      'Commercial lot clearing',
      'Sidewalk shoveling',
      'Salt and ice melt application',
      '24/7 emergency service',
      'Seasonal contracts available',
    ],
    benefits: [
      'Prevents slip and fall accidents',
      'Ensures property accessibility',
      'Reduces liability concerns',
      'Saves time on cold mornings',
      'Protects hardscape from damage',
    ],
    icon: 'Snowflake',
    heroImage: '/img/IMG_1974.JPG',
    galleryImages: [],
    category: 'seasonal',
    pricing: {
      basePrice: 50.00,
      unit: 'per push',
      variablePricing: true,
      priceRange: '$50-$150 per service',
    },
    pricingId: 'cleaning',
    equipment: ['Plow trucks', 'Salt spreaders', 'Snow blowers', 'Shovels', 'Ice melt'],
    certifications: ['Snow & Ice Management Association member (pending)'],
    availability: {
      seasonal: true,
      seasons: ['winter'],
      leadTime: 'Same day',
    },
    locations: 'all',
    featured: false,
    seoKeywords: ['snow removal', 'snow plowing', 'ice management', 'winter services', 'driveway plowing'],
    metaTitle: 'Snow Removal & Ice Management | Grandpa Ron\'s',
    metaDescription: 'Reliable snow plowing and ice management in Central Ohio. Residential and commercial. 24/7 emergency service available.',
    faqIds: ['snow-triggers', 'snow-contracts', 'ice-melt-safe'],
    relatedServiceIds: [],
  },
  {
    id: 'hardscaping',
    name: 'Patios & Retaining Walls',
    slug: 'hardscaping',
    shortDescription: 'Paver patios, retaining walls, and hardscape construction.',
    longDescription: `Extend your living space outdoors with Grandpa Ron's hardscaping services. We design and build beautiful, durable patios, walkways, and retaining walls using premium materials. Our experienced crew ensures proper base preparation and installation techniques for hardscape features that will last for decades.`,
    features: [
      'Paver patio installation',
      'Retaining wall construction',
      'Walkway and path design',
      'Fire pit surrounds',
      'Outdoor kitchen foundations',
      'Drainage integration',
    ],
    benefits: [
      'Creates functional outdoor living areas',
      'Adds significant property value',
      'Low maintenance surfaces',
      'Solves drainage and erosion issues',
      'Defines landscape zones',
    ],
    icon: 'Home',
    heroImage: '/img/IMG_1975.JPG',
    galleryImages: ['/img/IMG_1975.JPG', '/img/IMG_1979.JPG'],
    category: 'hardscaping',
    pricing: {
      basePrice: 22.00,
      unit: 'square foot',
      variablePricing: true,
      priceRange: '$15-$35 per square foot',
    },
    pricingId: 'pavers',
    equipment: ['Plate compactor', 'Concrete saw', 'Mini excavator', 'Levels', 'Hand tools'],
    certifications: ['ICPI Certified Installer (pending)'],
    availability: {
      seasonal: true,
      seasons: ['spring', 'summer', 'fall'],
      leadTime: '2-4 weeks',
    },
    locations: 'all',
    featured: true,
    seoKeywords: ['paver patio', 'retaining wall', 'hardscaping', 'outdoor living', 'patio installation'],
    metaTitle: 'Patio & Retaining Wall Installation | Grandpa Ron\'s',
    metaDescription: 'Professional paver patio and retaining wall installation in Central Ohio. Quality craftsmanship, lasting results. Free estimates!',
    faqIds: ['paver-types', 'retaining-wall-permits', 'hardscape-maintenance'],
    relatedServiceIds: ['landscaping', 'outdoor-lighting'],
  },
  {
    id: 'overseeding',
    name: 'Overseeding & Lawn Renovation',
    slug: 'overseeding',
    shortDescription: 'Thicken your lawn and repair bare spots with professional overseeding.',
    longDescription: `Revitalize your lawn with Grandpa Ron's overseeding services. We use premium grass seed varieties suited to Central Ohio's climate, proper seeding techniques, and careful preparation to ensure maximum germination. Whether you need to thicken an existing lawn or renovate a damaged area, we'll help you achieve a lush, healthy lawn.`,
    features: [
      'Core aeration included',
      'Premium seed varieties',
      'Starter fertilizer application',
      'Proper seed-to-soil contact',
      'Watering guidance provided',
      'Follow-up evaluation',
    ],
    benefits: [
      'Thicker, fuller lawn',
      'Crowds out weeds naturally',
      'Improves disease resistance',
      'Repairs thin and bare areas',
      'Refreshes older lawns',
    ],
    icon: 'Sprout',
    heroImage: '/img/IMG_1981.JPG',
    galleryImages: ['/img/IMG_1981.JPG', '/img/IMG_1971.JPG'],
    category: 'lawn-care',
    pricing: {
      basePrice: 0.25,
      unit: 'square foot',
      variablePricing: true,
      priceRange: '$200-$800 per 1,000 sq ft',
    },
    pricingId: 'seed',
    equipment: ['Core aerator', 'Slit seeder', 'Broadcast spreader', 'Rollers'],
    certifications: [],
    availability: {
      seasonal: true,
      seasons: ['fall', 'spring'],
      leadTime: '1 week',
    },
    locations: 'all',
    featured: false,
    seoKeywords: ['overseeding', 'lawn renovation', 'grass seeding', 'lawn thickening', 'bare spot repair'],
    metaTitle: 'Overseeding & Lawn Renovation | Grandpa Ron\'s',
    metaDescription: 'Professional overseeding and lawn renovation in Central Ohio. Thicken your lawn and repair bare spots. Fall is the best time!',
    faqIds: ['overseeding-timing', 'seed-types', 'watering-after-seeding'],
    relatedServiceIds: ['lawn-mowing', 'lawn-treatments', 'aeration'],
  },
];

// ============================================
// SERVICE REGISTRY CLASS
// ============================================

class ServiceRegistry {
  private services: Service[];

  constructor() {
    this.services = services;
  }

  getAllServices(): Service[] {
    return this.services;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(s => s.slug === slug);
  }

  getServicesByCategory(category: Service['category']): Service[] {
    return this.services.filter(s => s.category === category);
  }

  getFeaturedServices(): Service[] {
    return this.services.filter(s => s.featured);
  }

  getCategories(): Service['category'][] {
    return [...new Set(this.services.map(s => s.category))];
  }

  searchServices(query: string): Service[] {
    const q = query.toLowerCase();
    return this.services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.seoKeywords.some(k => k.toLowerCase().includes(q))
    );
  }

  getServicesForLocation(locationSlug: string): Service[] {
    return this.services.filter(s =>
      s.locations === 'all' || (Array.isArray(s.locations) && s.locations.includes(locationSlug))
    );
  }

  getSeasonalServices(season: 'spring' | 'summer' | 'fall' | 'winter'): Service[] {
    return this.services.filter(s =>
      !s.availability.seasonal || s.availability.seasons?.includes(season)
    );
  }

  getRelatedServices(serviceSlug: string): Service[] {
    const service = this.getServiceBySlug(serviceSlug);
    if (!service) return [];
    return this.services.filter(s =>
      service.relatedServiceIds.includes(s.id) && s.id !== service.id
    );
  }

  /**
   * Generate static params for Next.js
   */
  getStaticParams(): Array<{ slug: string }> {
    return this.services.map(s => ({ slug: s.slug }));
  }
}

export const serviceRegistry = new ServiceRegistry();
