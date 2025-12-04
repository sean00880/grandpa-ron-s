/**
 * Data exports for Grandpa Ron's Landscaping
 */

// Gallery data with multi-category semantic tags
export { galleryImages, default as galleryData } from './galleryData';

// Semantic taxonomy types and utilities
export {
  type PrimaryCategory,
  type ServiceType,
  type VisualTag,
  type PropertyType,
  type ImageTags,
  type GalleryImage,
  CATEGORY_DISPLAY_MAP,
  getImageDisplayCategories,
  filterImagesByCategory,
  getUniqueCategories,
} from './taxonomyRegistry';
