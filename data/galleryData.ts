/**
 * GALLERY DATA WITH MULTI-CATEGORY SEMANTIC TAGS
 * Each image is tagged with multiple categories based on visual analysis
 * Uses the SEMANTIC_TAXONOMY from taxonomyRegistry.ts
 */

import type {
  GalleryImage,
  ImageTags,
  PrimaryCategory,
  ServiceType,
  VisualTag,
  PropertyType,
} from './taxonomyRegistry';

export const galleryImages: GalleryImage[] = [
  // ============================================
  // IMG_1933 - Stone retaining wall with river rock
  // ============================================
  {
    id: 'img-1933',
    src: '/img/IMG_1933.JPG',
    alt: 'Curved stone retaining wall with river rock ground cover and ornamental tree',
    title: 'Stone Retaining Wall & Rock Bed',
    description: 'Curved block retaining wall with river rock ground cover surrounding a multi-trunk ornamental tree',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'decorative-stone', 'rock-mulch', 'planting', 'shrub-installation'],
      visualTags: ['stone', 'rock-bed', 'trees', 'shrubs', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1934 - Gravel pathway installation
  // ============================================
  {
    id: 'img-1934',
    src: '/img/IMG_1934.JPG',
    alt: 'Gravel pathway installation along side of house with new deck',
    title: 'Gravel Pathway & Drainage',
    description: 'Crushed gravel pathway installation with timber edging alongside elevated deck',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['gravel', 'walkway', 'drainage', 'edging'],
      visualTags: ['gravel-path', 'wood', 'in-progress', 'fresh-installation'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Landscaping'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1936 - Gravel area around deck
  // ============================================
  {
    id: 'img-1936',
    src: '/img/IMG_1936.JPG',
    alt: 'Gravel installation around deck with grading work',
    title: 'Deck Area Gravel Installation',
    description: 'Crushed gravel installation around deck foundation with ground preparation',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['gravel', 'drainage', 'bed-preparation'],
      visualTags: ['gravel-path', 'in-progress'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Landscaping'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1938 - Under-deck gravel with stone step
  // ============================================
  {
    id: 'img-1938',
    src: '/img/IMG_1938.JPG',
    alt: 'Under-deck crushed gravel area with decorative stone border step',
    title: 'Under-Deck Ground Cover',
    description: 'Crushed gravel installation under deck with decorative stone block step border',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['gravel', 'decorative-stone', 'steps', 'edging'],
      visualTags: ['gravel-path', 'stone', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Mulching'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1939 - Beautiful front yard with retaining wall
  // ============================================
  {
    id: 'img-1939',
    src: '/img/IMG_1939.JPG',
    alt: 'Manicured front yard with curved stone retaining wall and foundation plantings',
    title: 'Complete Front Yard Renovation',
    description: 'Curved stone retaining wall with lush foundation plantings and manicured lawn',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'planting', 'shrub-installation', 'lawn-maintenance'],
      visualTags: ['stone', 'shrubs', 'green-lawn', 'manicured-lawn', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Lawn Care'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1941 - Paver walkway with retaining wall
  // ============================================
  {
    id: 'img-1941',
    src: '/img/IMG_1941.JPG',
    alt: 'Brick paver walkway with stone retaining wall and foundation shrubs',
    title: 'Paver Walkway & Retaining Wall',
    description: 'Brick paver walkway with dark border alongside curved stone retaining wall and green lawn',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['walkway', 'paver-patio', 'retaining-wall', 'edging', 'shrub-installation', 'lawn-maintenance'],
      visualTags: ['pavers', 'brick', 'stone', 'shrubs', 'green-lawn', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Landscaping', 'Lawn Care'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1942 - Retaining wall construction (gravel base)
  // ============================================
  {
    id: 'img-1942',
    src: '/img/IMG_1942.JPG',
    alt: 'Retaining wall construction showing gravel base preparation',
    title: 'Retaining Wall Foundation Work',
    description: 'Excavation and gravel base preparation for retaining wall construction',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'gravel', 'drainage'],
      visualTags: ['stone', 'gravel-path', 'in-progress', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1943 - Concrete block wall foundation
  // ============================================
  {
    id: 'img-1943',
    src: '/img/IMG_1943.JPG',
    alt: 'Concrete block foundation installation for retaining wall',
    title: 'Wall Foundation Installation',
    description: 'Concrete block foundation with gravel base for retaining wall construction',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'drainage'],
      visualTags: ['concrete', 'in-progress', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1944 - Worker compacting gravel base
  // ============================================
  {
    id: 'img-1944',
    src: '/img/IMG_1944.JPG',
    alt: 'Worker compacting gravel base for retaining wall installation',
    title: 'Professional Wall Construction',
    description: 'Precision gravel base compaction for retaining wall with leveling',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'gravel'],
      visualTags: ['stone', 'in-progress', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1945 - Block foundation with rebar
  // ============================================
  {
    id: 'img-1945',
    src: '/img/IMG_1945.JPG',
    alt: 'Concrete block retaining wall foundation with rebar reinforcement',
    title: 'Reinforced Wall Foundation',
    description: 'Concrete block foundation with rebar reinforcement and gravel base',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall'],
      visualTags: ['concrete', 'in-progress', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1946 - Completed decorative retaining wall
  // ============================================
  {
    id: 'img-1946',
    src: '/img/IMG_1946.JPG',
    alt: 'Completed decorative stone retaining wall with cap stones and drainage',
    title: 'Decorative Retaining Wall',
    description: 'Finished decorative stone face retaining wall with dark cap stones and PVC drainage',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'drainage', 'decorative-stone'],
      visualTags: ['stone', 'gravel-path', 'completed-work'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1949 - Flower bed with stone border
  // ============================================
  {
    id: 'img-1949',
    src: '/img/IMG_1949.JPG',
    alt: 'Stone border flower bed with fresh mulch and pink flowering plants',
    title: 'Flower Bed Installation',
    description: 'Tumbled stone border with fresh dark mulch and pink flowering annuals',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting', 'flower-beds', 'annuals', 'shrub-installation'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'flowers', 'shrubs', 'front-yard', 'foundation-planting', 'grass'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1950 - Curved flower bed with multiple plantings
  // ============================================
  {
    id: 'img-1950',
    src: '/img/IMG_1950.JPG',
    alt: 'Curved stone border bed with hydrangeas, hostas, and ornamental plants',
    title: 'Multi-Plant Garden Bed',
    description: 'Curved stone border with diverse plantings including hydrangeas, hostas, ornamental grasses, and solar lights',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting', 'flower-beds', 'perennials', 'shrub-installation', 'garden-beds'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'flowers', 'shrubs', 'perennial-plants', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1951 - Same property different angle
  // ============================================
  {
    id: 'img-1951',
    src: '/img/IMG_1951.JPG',
    alt: 'Curved flower bed with hydrangeas and white decorative stones',
    title: 'Garden Bed with Accent Stones',
    description: 'Curved stone border bed with colorful flowers, white decorative stones, and solar pathway lights',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting', 'flower-beds', 'perennials', 'decorative-stone'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'flowers', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1955 - Curved retaining wall with river rock
  // ============================================
  {
    id: 'img-1955',
    src: '/img/IMG_1955.JPG',
    alt: 'Curved tumbled stone retaining wall with river rock ground cover',
    title: 'Rock Garden Retaining Wall',
    description: 'Curved tumbled stone retaining wall filled with river rock ground cover',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'rock-mulch', 'decorative-stone', 'edging'],
      visualTags: ['stone', 'rock-bed', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Mulching'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1956 - Foundation shrubs with mulch
  // ============================================
  {
    id: 'img-1956',
    src: '/img/IMG_1956.JPG',
    alt: 'Foundation planting with shaped boxwood shrubs and fresh dark mulch',
    title: 'Foundation Shrub Bed',
    description: 'Rounded boxwood foundation shrubs with fresh dark mulch and stone block edging',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'shrub-installation', 'edging', 'bed-preparation'],
      visualTags: ['shrubs', 'fresh-mulch', 'dark-mulch', 'stone', 'front-yard', 'foundation-planting', 'trees', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching', 'Hardscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1958 - Large curved landscape bed
  // ============================================
  {
    id: 'img-1958',
    src: '/img/IMG_1958.JPG',
    alt: 'Large curved landscape bed with flowering plants and stone border',
    title: 'Expansive Flower Garden',
    description: 'Large curved landscape bed with multiple pink/purple flowering plants, stone border, and mature tree',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting', 'flower-beds', 'perennials', 'annuals'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'flowers', 'trees', 'shrubs', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1959 - Large curved mulch bed
  // ============================================
  {
    id: 'img-1959',
    src: '/img/IMG_1959.JPG',
    alt: 'Large curved mulch bed with stone border and foundation shrubs',
    title: 'Curved Mulch Bed Installation',
    description: 'Large curved landscape bed with stone block border, fresh dark mulch, and foundation plantings',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['edging', 'mulching', 'shrub-installation', 'bed-preparation'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'trees', 'shrubs', 'front-yard', 'foundation-planting', 'green-lawn'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1960 - Same property wider view
  // ============================================
  {
    id: 'img-1960',
    src: '/img/IMG_1960.JPG',
    alt: 'Wide view of curved landscape bed with Japanese maple and lush lawn',
    title: 'Complete Landscape View',
    description: 'Expansive curved mulch bed with ornamental trees, foundation shrubs, and thick green lawn',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting', 'shrub-installation', 'tree-planting', 'lawn-maintenance'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'trees', 'ornamental-trees', 'shrubs', 'green-lawn', 'thick-grass', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching', 'Lawn Care', 'Hardscaping'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1962 - Curved mulch bed around walkway
  // ============================================
  {
    id: 'img-1962',
    src: '/img/IMG_1962.JPG',
    alt: 'Curved mulch bed along walkway with hostas and ornamental trees',
    title: 'Walkway Border Garden',
    description: 'Fresh dark mulch bed along curved walkway with hostas, shrubs, and multi-trunk tree',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'planting', 'perennials', 'shrub-installation'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'trees', 'shrubs', 'perennial-plants', 'walkway-border', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1964 - Walkway border with hostas
  // ============================================
  {
    id: 'img-1964',
    src: '/img/IMG_1964.JPG',
    alt: 'Walkway border planting with variegated hostas and ornamental grasses',
    title: 'Perennial Walkway Border',
    description: 'Fresh dark mulch border along walkway with variegated hostas, ornamental grasses, and young trees',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['mulching', 'planting', 'perennials', 'ornamental-grasses', 'tree-planting'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'perennial-plants', 'trees', 'walkway-border', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1965 - Retaining wall construction/repair
  // ============================================
  {
    id: 'img-1965',
    src: '/img/IMG_1965.JPG',
    alt: 'Retaining wall construction in progress with curved design',
    title: 'Retaining Wall Construction',
    description: 'Curved retaining wall installation in front yard with foundation shrub',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'edging'],
      visualTags: ['stone', 'in-progress', 'front-yard', 'shrubs'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1968 - Worker installing stone border
  // ============================================
  {
    id: 'img-1968',
    src: '/img/IMG_1968.JPG',
    alt: 'Worker installing stone border around shaped boxwood shrubs',
    title: 'Border Installation in Progress',
    description: 'Professional installation of stone block border with fresh mulch and shaped boxwood',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'shrub-installation'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'shrubs', 'in-progress', 'equipment-visible', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Landscaping', 'Mulching'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1971 - Completed curved retaining wall
  // ============================================
  {
    id: 'img-1971',
    src: '/img/IMG_1971.JPG',
    alt: 'Beautiful curved stone retaining wall with shaped boxwood and lush lawn',
    title: 'Complete Landscape Transformation',
    description: 'Finished curved stone retaining wall with shaped boxwood shrubs, fresh mulch, and manicured lawn',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['retaining-wall', 'edging', 'mulching', 'shrub-installation', 'lawn-maintenance'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'shrubs', 'trees', 'green-lawn', 'manicured-lawn', 'front-yard', 'completed-work'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching', 'Lawn Care'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1974 - Curved mulch bed around evergreen
  // ============================================
  {
    id: 'img-1974',
    src: '/img/IMG_1974.JPG',
    alt: 'Curved mulch bed with fresh dark mulch around large evergreen shrub',
    title: 'Evergreen Mulch Bed',
    description: 'Curved mulch bed with clean edge and fresh dark mulch surrounding large evergreen',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'bed-edging', 'bed-preparation'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'shrubs', 'evergreens', 'lawn-edging', 'green-lawn', 'side-yard'],
      propertyType: 'residential',
      displayCategories: ['Mulching', 'Landscaping'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1975 - Close-up mulch around evergreen
  // ============================================
  {
    id: 'img-1975',
    src: '/img/IMG_1975.JPG',
    alt: 'Close-up of fresh dark mulch with clean curved edge around evergreen',
    title: 'Fresh Mulch Application',
    description: 'Detailed view of fresh dark mulch with precision curved edging around evergreen shrub',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'bed-edging'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'evergreens', 'lawn-edging', 'green-lawn', 'thick-grass'],
      propertyType: 'residential',
      displayCategories: ['Mulching', 'Landscaping', 'Lawn Care'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1977 - Paver patio with gravel
  // ============================================
  {
    id: 'img-1977',
    src: '/img/IMG_1977.JPG',
    alt: 'Stone paver patio with pea gravel joints and arborvitae plantings',
    title: 'Paver Patio Installation',
    description: 'Large format stone pavers with pea gravel joints, bordered by crushed stone and arborvitae shrubs',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['paver-patio', 'gravel', 'decorative-stone', 'shrub-installation'],
      visualTags: ['pavers', 'stone', 'gravel-path', 'evergreens', 'patio-area', 'completed-work'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Landscaping'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
    featured: true,
  },

  // ============================================
  // IMG_1978 - Bed preparation/edging
  // ============================================
  {
    id: 'img-1978',
    src: '/img/IMG_1978.JPG',
    alt: 'Curved bed edge preparation with soil work in progress',
    title: 'Bed Edge Preparation',
    description: 'Curved bed edge cut and soil preparation for mulch installation',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['bed-edging', 'bed-preparation'],
      visualTags: ['in-progress', 'green-lawn', 'lawn-edging'],
      propertyType: 'residential',
      displayCategories: ['Mulching', 'Landscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1979 - Tree ring mulching
  // ============================================
  {
    id: 'img-1979',
    src: '/img/IMG_1979.JPG',
    alt: 'Fresh dark mulch tree rings around mature trees with separate bed',
    title: 'Tree Ring Mulching',
    description: 'Fresh dark mulch applied in tree rings around mature trees with separate foundation bed',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'bed-edging'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'trees', 'shrubs', 'green-lawn', 'front-yard'],
      propertyType: 'residential',
      displayCategories: ['Mulching', 'Landscaping', 'Lawn Care'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1981 - Stone border with boxwood and mulch
  // ============================================
  {
    id: 'img-1981',
    src: '/img/IMG_1981.JPG',
    alt: 'Stone block border bed with shaped boxwood shrubs and fresh dark mulch',
    title: 'Boxwood Foundation Bed',
    description: 'Curved stone block border with shaped boxwood shrubs, fresh dark mulch, and mature tree',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['edging', 'mulching', 'shrub-installation'],
      visualTags: ['stone', 'fresh-mulch', 'dark-mulch', 'shrubs', 'trees', 'green-lawn', 'front-yard', 'foundation-planting'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Hardscaping', 'Mulching'],
    },
    category: 'Lawn Care',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1982 - Bed preparation before mulch
  // ============================================
  {
    id: 'img-1982',
    src: '/img/IMG_1982.JPG',
    alt: 'Bed preparation showing perennial plants before mulch application',
    title: 'Pre-Mulch Bed Preparation',
    description: 'Curved bed with perennials (daylilies, hostas) and lamp post ready for mulch',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['bed-preparation', 'planting', 'perennials'],
      visualTags: ['perennial-plants', 'shrubs', 'in-progress', 'front-yard', 'walkway-border', 'equipment-visible'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1983 - Completed mulch bed with perennials
  // ============================================
  {
    id: 'img-1983',
    src: '/img/IMG_1983.JPG',
    alt: 'Completed landscape bed with fresh mulch, perennials, and decorative boulder',
    title: 'Complete Perennial Garden',
    description: 'Finished landscape bed with fresh dark mulch, perennial plants, lamp post, and decorative boulder accent',
    tags: {
      primaryCategory: 'maintenance',
      serviceTypes: ['mulching', 'planting', 'perennials', 'shrub-installation', 'decorative-stone'],
      visualTags: ['fresh-mulch', 'dark-mulch', 'perennial-plants', 'shrubs', 'boulder', 'green-lawn', 'front-yard', 'completed-work'],
      propertyType: 'residential',
      displayCategories: ['Landscaping', 'Mulching', 'Lawn Care'],
    },
    category: 'Tree Service',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1984 - Brick border with fresh mulch
  // ============================================
  {
    id: 'img-1984',
    src: '/img/IMG_1984.JPG',
    alt: 'Red brick border edging with fresh dark mulch and small plants',
    title: 'Brick Edge Foundation Bed',
    description: 'Red brick border edging with fresh dark mulch along foundation',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'planting'],
      visualTags: ['brick', 'fresh-mulch', 'dark-mulch', 'shrubs', 'front-yard', 'foundation-planting', 'green-lawn'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Mulching', 'Landscaping'],
    },
    category: 'Mulching',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1985 - Wide view brick border bed
  // ============================================
  {
    id: 'img-1985',
    src: '/img/IMG_1985.JPG',
    alt: 'Wide view of red brick border foundation bed with fresh mulch',
    title: 'Foundation Bed Renovation',
    description: 'Complete foundation bed renovation with red brick border, fresh dark mulch, and shrubs',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'shrub-installation', 'lawn-maintenance'],
      visualTags: ['brick', 'fresh-mulch', 'dark-mulch', 'shrubs', 'front-yard', 'foundation-planting', 'green-lawn', 'trees'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Mulching', 'Landscaping', 'Lawn Care'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },

  // ============================================
  // IMG_1986 - Final brick border view
  // ============================================
  {
    id: 'img-1986',
    src: '/img/IMG_1986.jpg',
    alt: 'Complete brick border foundation bed installation',
    title: 'Brick Border Complete',
    description: 'Finished brick border foundation bed with fresh dark mulch and maintained lawn',
    tags: {
      primaryCategory: 'development',
      serviceTypes: ['edging', 'mulching', 'shrub-installation', 'lawn-maintenance'],
      visualTags: ['brick', 'fresh-mulch', 'dark-mulch', 'shrubs', 'front-yard', 'foundation-planting', 'green-lawn', 'trees', 'completed-work'],
      propertyType: 'residential',
      displayCategories: ['Hardscaping', 'Mulching', 'Landscaping', 'Lawn Care'],
    },
    category: 'Landscaping',
    location: 'Central Ohio',
  },
];

// Export for backwards compatibility
export default galleryImages;
