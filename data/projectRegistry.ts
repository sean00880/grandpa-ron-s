/**
 * Project Registry - Portfolio/Gallery data for programmatic pages
 * Links projects to services and locations for cross-referencing
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  serviceSlug: string;
  locationSlug?: string;
  locationName?: string;
  beforeImage?: string;
  afterImage: string;
  galleryImages: string[];
  completionDate: string;
  duration: string;
  testimonial?: {
    customer: string;
    quote: string;
    rating: number;
  };
  featured: boolean;
  tags: string[];
}

const projects: Project[] = [
  // Landscaping Projects
  {
    id: 'landscaping-1',
    title: 'Complete Front Yard Transformation',
    slug: 'front-yard-transformation-canal-winchester',
    description: 'Full front yard redesign including new plantings, mulch beds, and decorative stone accents for a Canal Winchester home.',
    serviceSlug: 'landscaping',
    locationSlug: 'canal-winchester-oh',
    locationName: 'Canal Winchester',
    afterImage: '/img/IMG_1933.JPG',
    galleryImages: ['/img/IMG_1933.JPG', '/img/IMG_1934.JPG'],
    completionDate: '2024-09',
    duration: '3 days',
    testimonial: {
      customer: 'The Martinez Family',
      quote: 'They transformed our tired front yard into a beautiful welcoming space. Neighbors keep stopping to compliment it!',
      rating: 5,
    },
    featured: true,
    tags: ['landscaping', 'front-yard', 'curb-appeal'],
  },
  {
    id: 'landscaping-2',
    title: 'Backyard Garden Installation',
    slug: 'backyard-garden-groveport',
    description: 'New garden bed installation with native perennials and ornamental grasses for a Groveport residence.',
    serviceSlug: 'landscaping',
    locationSlug: 'groveport-oh',
    locationName: 'Groveport',
    afterImage: '/img/IMG_1944.JPG',
    galleryImages: ['/img/IMG_1944.JPG', '/img/IMG_1945.JPG'],
    completionDate: '2024-08',
    duration: '2 days',
    featured: false,
    tags: ['landscaping', 'garden-beds', 'perennials'],
  },
  {
    id: 'landscaping-3',
    title: 'Foundation Planting Renovation',
    slug: 'foundation-planting-pickerington',
    description: 'Removed overgrown shrubs and installed new foundation plantings with proper spacing and layered heights.',
    serviceSlug: 'landscaping',
    locationSlug: 'pickerington-oh',
    locationName: 'Pickerington',
    afterImage: '/img/IMG_1958.JPG',
    galleryImages: ['/img/IMG_1958.JPG', '/img/IMG_1959.JPG'],
    completionDate: '2024-07',
    duration: '2 days',
    featured: true,
    tags: ['landscaping', 'foundation-planting', 'shrubs'],
  },
  {
    id: 'landscaping-4',
    title: 'Residential Landscape Design',
    slug: 'landscape-design-lithopolis',
    description: 'Custom landscape design and installation featuring native plants and sustainable practices.',
    serviceSlug: 'landscaping',
    locationSlug: 'lithopolis-oh',
    locationName: 'Lithopolis',
    afterImage: '/img/IMG_1968.JPG',
    galleryImages: ['/img/IMG_1968.JPG', '/img/IMG_1974.JPG', '/img/IMG_1975.JPG'],
    completionDate: '2024-06',
    duration: '4 days',
    featured: true,
    tags: ['landscaping', 'design', 'native-plants'],
  },

  // Mulching Projects
  {
    id: 'mulching-1',
    title: 'Large Property Mulch Installation',
    slug: 'large-mulch-installation-lancaster',
    description: '15 cubic yards of premium hardwood mulch installed across multiple garden beds on a Lancaster estate.',
    serviceSlug: 'mulching',
    locationSlug: 'lancaster-oh',
    locationName: 'Lancaster',
    afterImage: '/img/IMG_1942.JPG',
    galleryImages: ['/img/IMG_1942.JPG', '/img/IMG_1943.JPG'],
    completionDate: '2024-09',
    duration: '1 day',
    testimonial: {
      customer: 'Robert K.',
      quote: 'Fast, professional service. The mulch looks fantastic and they cleaned up completely when finished.',
      rating: 5,
    },
    featured: true,
    tags: ['mulching', 'hardwood-mulch', 'large-property'],
  },
  {
    id: 'mulching-2',
    title: 'Garden Bed Refresh',
    slug: 'garden-bed-refresh-reynoldsburg',
    description: 'Removed old mulch, edged beds, and applied fresh colored mulch to rejuvenate garden appearance.',
    serviceSlug: 'mulching',
    locationSlug: 'reynoldsburg-oh',
    locationName: 'Reynoldsburg',
    afterImage: '/img/IMG_1955.JPG',
    galleryImages: ['/img/IMG_1955.JPG', '/img/IMG_1956.JPG'],
    completionDate: '2024-08',
    duration: '4 hours',
    featured: false,
    tags: ['mulching', 'bed-refresh', 'edging'],
  },
  {
    id: 'mulching-3',
    title: 'Commercial Property Mulching',
    slug: 'commercial-mulching-columbus',
    description: 'Annual mulch refresh for a Columbus business park, covering all common area beds.',
    serviceSlug: 'mulching',
    locationSlug: 'columbus-oh',
    locationName: 'Columbus',
    afterImage: '/img/IMG_1965.JPG',
    galleryImages: ['/img/IMG_1965.JPG', '/img/IMG_1978.JPG', '/img/IMG_1984.JPG'],
    completionDate: '2024-05',
    duration: '2 days',
    featured: false,
    tags: ['mulching', 'commercial', 'maintenance'],
  },

  // Tree Service Projects
  {
    id: 'tree-1',
    title: 'Large Oak Tree Trimming',
    slug: 'oak-tree-trimming-canal-winchester',
    description: 'Crown thinning and deadwood removal on a mature oak tree to improve health and light penetration.',
    serviceSlug: 'tree-trimming',
    locationSlug: 'canal-winchester-oh',
    locationName: 'Canal Winchester',
    afterImage: '/img/IMG_1939.JPG',
    galleryImages: ['/img/IMG_1939.JPG', '/img/IMG_1941.JPG'],
    completionDate: '2024-08',
    duration: '6 hours',
    featured: true,
    tags: ['tree-service', 'oak', 'crown-thinning'],
  },
  {
    id: 'tree-2',
    title: 'Storm Damage Cleanup',
    slug: 'storm-damage-cleanup-baltimore',
    description: 'Emergency response to remove fallen limbs and damaged trees after severe thunderstorm.',
    serviceSlug: 'tree-trimming',
    locationSlug: 'baltimore-oh',
    locationName: 'Baltimore',
    afterImage: '/img/IMG_1950.JPG',
    galleryImages: ['/img/IMG_1950.JPG', '/img/IMG_1951.JPG'],
    completionDate: '2024-07',
    duration: '8 hours',
    testimonial: {
      customer: 'Nancy S.',
      quote: 'They came out the same day after the storm and had everything cleaned up by evening. Absolute lifesavers!',
      rating: 5,
    },
    featured: true,
    tags: ['tree-service', 'storm-damage', 'emergency'],
  },
  {
    id: 'tree-3',
    title: 'View Enhancement Pruning',
    slug: 'view-pruning-pataskala',
    description: 'Selective pruning of multiple trees to restore backyard views while maintaining privacy.',
    serviceSlug: 'tree-trimming',
    locationSlug: 'pataskala-oh',
    locationName: 'Pataskala',
    afterImage: '/img/IMG_1962.JPG',
    galleryImages: ['/img/IMG_1962.JPG', '/img/IMG_1964.JPG'],
    completionDate: '2024-06',
    duration: '5 hours',
    featured: false,
    tags: ['tree-service', 'pruning', 'view-enhancement'],
  },
  {
    id: 'tree-4',
    title: 'Multi-Tree Trimming Project',
    slug: 'multi-tree-trimming-obetz',
    description: 'Annual maintenance trimming for 8 trees on residential property in Obetz.',
    serviceSlug: 'tree-trimming',
    locationSlug: 'obetz-oh',
    locationName: 'Obetz',
    afterImage: '/img/IMG_1977.JPG',
    galleryImages: ['/img/IMG_1977.JPG', '/img/IMG_1983.JPG'],
    completionDate: '2024-05',
    duration: '1 day',
    featured: false,
    tags: ['tree-service', 'maintenance', 'residential'],
  },

  // Lawn Care Projects
  {
    id: 'lawn-1',
    title: 'Weekly Lawn Maintenance',
    slug: 'weekly-lawn-maintenance-canal-winchester',
    description: 'Regular weekly mowing, edging, and blowing for a 1-acre residential property.',
    serviceSlug: 'lawn-mowing',
    locationSlug: 'canal-winchester-oh',
    locationName: 'Canal Winchester',
    afterImage: '/img/IMG_1936.JPG',
    galleryImages: ['/img/IMG_1936.JPG', '/img/IMG_1938.JPG'],
    completionDate: '2024-ongoing',
    duration: 'Weekly service',
    featured: true,
    tags: ['lawn-care', 'mowing', 'maintenance'],
  },
  {
    id: 'lawn-2',
    title: 'Commercial Property Lawn Service',
    slug: 'commercial-lawn-service-groveport',
    description: 'Bi-weekly lawn maintenance for a small business complex including common areas.',
    serviceSlug: 'lawn-mowing',
    locationSlug: 'groveport-oh',
    locationName: 'Groveport',
    afterImage: '/img/IMG_1946.JPG',
    galleryImages: ['/img/IMG_1946.JPG', '/img/IMG_1949.JPG'],
    completionDate: '2024-ongoing',
    duration: 'Bi-weekly service',
    featured: false,
    tags: ['lawn-care', 'commercial', 'mowing'],
  },
  {
    id: 'lawn-3',
    title: 'Large Estate Mowing',
    slug: 'estate-mowing-pickerington',
    description: 'Weekly service for 3-acre estate with precision striping and detailed edging.',
    serviceSlug: 'lawn-mowing',
    locationSlug: 'pickerington-oh',
    locationName: 'Pickerington',
    afterImage: '/img/IMG_1960.JPG',
    galleryImages: ['/img/IMG_1960.JPG', '/img/IMG_1971.JPG', '/img/IMG_1981.JPG'],
    completionDate: '2024-ongoing',
    duration: 'Weekly service',
    testimonial: {
      customer: 'The Thompson Family',
      quote: 'Best lawn service we\'ve ever had. Consistent, reliable, and our lawn has never looked better.',
      rating: 5,
    },
    featured: true,
    tags: ['lawn-care', 'estate', 'striping'],
  },

  // Hardscaping Projects
  {
    id: 'hardscape-1',
    title: 'Paver Patio Installation',
    slug: 'paver-patio-lithopolis',
    description: '400 sq ft paver patio with sitting wall and fire pit area for outdoor entertaining.',
    serviceSlug: 'hardscaping',
    locationSlug: 'lithopolis-oh',
    locationName: 'Lithopolis',
    afterImage: '/img/IMG_1975.JPG',
    galleryImages: ['/img/IMG_1975.JPG', '/img/IMG_1979.JPG'],
    completionDate: '2024-07',
    duration: '5 days',
    testimonial: {
      customer: 'Mike and Sarah D.',
      quote: 'The patio exceeded our expectations. We spend every evening out there now!',
      rating: 5,
    },
    featured: true,
    tags: ['hardscaping', 'patio', 'pavers', 'fire-pit'],
  },
  {
    id: 'hardscape-2',
    title: 'Retaining Wall Construction',
    slug: 'retaining-wall-lancaster',
    description: '50 linear ft retaining wall to address drainage issues and create usable yard space.',
    serviceSlug: 'hardscaping',
    locationSlug: 'lancaster-oh',
    locationName: 'Lancaster',
    afterImage: '/img/IMG_1982.JPG',
    galleryImages: ['/img/IMG_1982.JPG', '/img/IMG_1985.JPG'],
    completionDate: '2024-06',
    duration: '4 days',
    featured: false,
    tags: ['hardscaping', 'retaining-wall', 'drainage'],
  },
];

// ============================================
// PROJECT REGISTRY CLASS
// ============================================

class ProjectRegistry {
  private projects: Project[];

  constructor() {
    this.projects = projects;
  }

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.find(p => p.slug === slug);
  }

  getFeaturedProjects(): Project[] {
    return this.projects.filter(p => p.featured);
  }

  getProjectsByService(serviceSlug: string): Project[] {
    return this.projects.filter(p => p.serviceSlug === serviceSlug);
  }

  getProjectsByLocation(locationSlug: string): Project[] {
    return this.projects.filter(p => p.locationSlug === locationSlug);
  }

  getProjectsByTag(tag: string): Project[] {
    return this.projects.filter(p => p.tags.includes(tag));
  }

  searchProjects(query: string): Project[] {
    const q = query.toLowerCase();
    return this.projects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  getRecentProjects(limit: number = 6): Project[] {
    return [...this.projects]
      .sort((a, b) => b.completionDate.localeCompare(a.completionDate))
      .slice(0, limit);
  }

  /**
   * Get all unique tags
   */
  getTags(): string[] {
    const tagSet = new Set<string>();
    this.projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }

  /**
   * Generate static params for Next.js
   */
  getStaticParams(): Array<{ slug: string }> {
    return this.projects.map(p => ({ slug: p.slug }));
  }
}

export const projectRegistry = new ProjectRegistry();
