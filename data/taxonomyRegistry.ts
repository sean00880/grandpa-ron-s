/**
 * SEMANTIC TAXONOMY REGISTRY
 * Industry-standard landscaping classification system
 * Based on NAICS codes, NALP standards, and modern landscaping taxonomy
 *
 * This registry enables multi-dimensional tagging of portfolio images
 * allowing them to appear in multiple service categories simultaneously.
 */

// ============================================
// PRIMARY SERVICE CATEGORIES (NAICS-aligned)
// ============================================
export type PrimaryCategory =
  | 'maintenance'      // NAICS 561730 - Landscaping Services (maintenance)
  | 'development'      // NAICS 561730 - Landscaping Services (installation)
  | 'design'           // NAICS 541320 - Landscape Architectural Services
  | 'seasonal';        // Seasonal-specific services

// ============================================
// SECONDARY SERVICE TYPES
// ============================================
export type ServiceType =
  // Lawn Care (Softscaping - Living Elements)
  | 'lawn-mowing'
  | 'lawn-maintenance'
  | 'overseeding'
  | 'aeration'
  | 'fertilization'
  | 'weed-control'
  | 'lawn-renovation'

  // Landscaping (Softscaping - Plantings)
  | 'planting'
  | 'garden-beds'
  | 'flower-beds'
  | 'shrub-installation'
  | 'tree-planting'
  | 'perennials'
  | 'annuals'
  | 'native-plants'
  | 'ornamental-grasses'

  // Hardscaping (Non-living Elements)
  | 'paver-patio'
  | 'retaining-wall'
  | 'walkway'
  | 'steps'
  | 'fire-pit'
  | 'outdoor-kitchen'
  | 'edging'
  | 'decorative-stone'
  | 'gravel'
  | 'drainage'

  // Mulching & Ground Cover
  | 'mulching'
  | 'hardwood-mulch'
  | 'colored-mulch'
  | 'rubber-mulch'
  | 'rock-mulch'
  | 'bed-edging'
  | 'bed-preparation'

  // Tree Services (Arboriculture)
  | 'tree-trimming'
  | 'tree-pruning'
  | 'tree-removal'
  | 'stump-grinding'
  | 'crown-thinning'
  | 'deadwood-removal'
  | 'storm-damage'

  // Seasonal Services
  | 'spring-cleanup'
  | 'fall-cleanup'
  | 'leaf-removal'
  | 'snow-removal'
  | 'ice-management'
  | 'winterization';

// ============================================
// VISUAL/FEATURE TAGS (What you see in image)
// ============================================
export type VisualTag =
  // Plant Types Visible
  | 'trees'
  | 'shrubs'
  | 'flowers'
  | 'grass'
  | 'hedges'
  | 'ornamental-trees'
  | 'evergreens'
  | 'deciduous'
  | 'perennial-plants'
  | 'annual-plants'

  // Hardscape Features Visible
  | 'pavers'
  | 'stone'
  | 'brick'
  | 'concrete'
  | 'wood'
  | 'metal-edging'
  | 'boulder'
  | 'gravel-path'
  | 'stepping-stones'

  // Ground Cover Visible
  | 'mulch-bed'
  | 'fresh-mulch'
  | 'dark-mulch'
  | 'red-mulch'
  | 'natural-mulch'
  | 'rock-bed'

  // Lawn Features Visible
  | 'striped-lawn'
  | 'freshly-mowed'
  | 'thick-grass'
  | 'green-lawn'
  | 'manicured-lawn'
  | 'lawn-edging'

  // Structure/Location Features
  | 'front-yard'
  | 'backyard'
  | 'side-yard'
  | 'foundation-planting'
  | 'property-line'
  | 'driveway-adjacent'
  | 'walkway-border'
  | 'patio-area'
  | 'pool-area'

  // Work Type Indicators
  | 'before-after'
  | 'in-progress'
  | 'completed-work'
  | 'equipment-visible'
  | 'fresh-installation';

// ============================================
// PROPERTY TYPE TAGS
// ============================================
export type PropertyType =
  | 'residential'
  | 'commercial'
  | 'municipal'
  | 'hoa'
  | 'estate'
  | 'small-lot'
  | 'large-lot'
  | 'acreage';

// ============================================
// COMPLETE IMAGE TAG INTERFACE
// ============================================
export interface ImageTags {
  // Required
  primaryCategory: PrimaryCategory;
  serviceTypes: ServiceType[];

  // Optional but recommended
  visualTags?: VisualTag[];
  propertyType?: PropertyType;

  // For filtering UI
  displayCategories: string[]; // Human-readable category names for filtering
}

// ============================================
// CATEGORY DISPLAY MAPPING
// ============================================
export const CATEGORY_DISPLAY_MAP: Record<string, { label: string; services: ServiceType[] }> = {
  'Lawn Care': {
    label: 'Lawn Care',
    services: ['lawn-mowing', 'lawn-maintenance', 'overseeding', 'aeration', 'fertilization', 'weed-control', 'lawn-renovation'],
  },
  'Landscaping': {
    label: 'Landscaping',
    services: ['planting', 'garden-beds', 'flower-beds', 'shrub-installation', 'tree-planting', 'perennials', 'annuals', 'native-plants', 'ornamental-grasses'],
  },
  'Mulching': {
    label: 'Mulching',
    services: ['mulching', 'hardwood-mulch', 'colored-mulch', 'bed-edging', 'bed-preparation'],
  },
  'Tree Service': {
    label: 'Tree Service',
    services: ['tree-trimming', 'tree-pruning', 'tree-removal', 'stump-grinding', 'crown-thinning', 'deadwood-removal', 'storm-damage'],
  },
  'Hardscaping': {
    label: 'Hardscaping',
    services: ['paver-patio', 'retaining-wall', 'walkway', 'steps', 'fire-pit', 'edging', 'decorative-stone', 'drainage'],
  },
  'Seasonal': {
    label: 'Seasonal',
    services: ['spring-cleanup', 'fall-cleanup', 'leaf-removal', 'snow-removal', 'ice-management', 'winterization'],
  },
};

// ============================================
// GALLERY IMAGE INTERFACE (Enhanced)
// ============================================
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;

  // Multi-category support
  tags: ImageTags;

  // Legacy single category (for backwards compatibility)
  category: string;

  // Metadata
  location?: string;
  completionDate?: string;
  featured?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all display categories an image belongs to
 */
export function getImageDisplayCategories(tags: ImageTags): string[] {
  const categories = new Set<string>();

  for (const [categoryName, categoryData] of Object.entries(CATEGORY_DISPLAY_MAP)) {
    if (tags.serviceTypes.some(service => categoryData.services.includes(service))) {
      categories.add(categoryName);
    }
  }

  return Array.from(categories);
}

/**
 * Filter images by any matching category
 */
export function filterImagesByCategory(images: GalleryImage[], category: string): GalleryImage[] {
  if (category === 'All') return images;

  return images.filter(img =>
    img.tags.displayCategories.includes(category) ||
    getImageDisplayCategories(img.tags).includes(category)
  );
}

/**
 * Get unique categories from a list of images
 */
export function getUniqueCategories(images: GalleryImage[]): string[] {
  const categories = new Set<string>();

  images.forEach(img => {
    img.tags.displayCategories.forEach(cat => categories.add(cat));
  });

  return ['All', ...Array.from(categories).sort()];
}
