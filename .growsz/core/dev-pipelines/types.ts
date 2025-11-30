/**
 * Core Types for Grandpa Ron GROWSZ Infrastructure
 *
 * Shared type definitions used across registries and development pipelines
 */

// ============================================================================
// Tier System
// ============================================================================

/**
 * Pricing tier identifiers
 */
export type TierId =
  | 'free'
  | 'customer'
  | 'provider'
  | 'provider-pro'
  | 'enterprise';

/**
 * Environment identifiers
 */
export type EnvId =
  | 'local'
  | 'dev'
  | 'staging'
  | 'production'
  | 'preview';

/**
 * Service categories for lawncare platform
 */
export type ServiceCategory =
  | 'lawn-care'
  | 'tree-services'
  | 'landscaping'
  | 'roofing'
  | 'solar'
  | 'contracting'
  | 'general';

/**
 * User role types
 */
export type UserRole =
  | 'customer'
  | 'provider'
  | 'admin'
  | 'super-admin';

/**
 * Booking status
 */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

/**
 * Payment status
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// ============================================================================
// AI/ML Types
// ============================================================================

/**
 * AI model provider
 */
export type AIProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'perplexity'
  | 'local';

/**
 * AI task type
 */
export type AITaskType =
  | 'quote-generation'
  | 'property-analysis'
  | 'scheduling'
  | 'customer-support'
  | 'price-estimation'
  | 'image-analysis';

// ============================================================================
// Platform Types
// ============================================================================

/**
 * Feature flag status
 */
export type FeatureFlagStatus =
  | 'enabled'
  | 'disabled'
  | 'beta'
  | 'deprecated';

/**
 * API request method
 */
export type APIMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

/**
 * Database provider
 */
export type DatabaseProvider =
  | 'supabase'
  | 'prisma'
  | 'mongodb'
  | 'postgres'
  | 'mysql';

/**
 * Storage provider
 */
export type StorageProvider =
  | 'supabase-storage'
  | 's3'
  | 'cloudinary'
  | 'vercel-blob';

/**
 * Email provider
 */
export type EmailProvider =
  | 'emailjs'
  | 'sendgrid'
  | 'resend'
  | 'postmark';

/**
 * Analytics provider
 */
export type AnalyticsProvider =
  | 'vercel-analytics'
  | 'google-analytics'
  | 'mixpanel'
  | 'posthog';
