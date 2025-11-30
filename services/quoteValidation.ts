/**
 * Quote Validation and Price Enforcement Module
 * 
 * This module ensures deterministic, data-driven quote generation by:
 * 1. Enforcing fixed pricing from the registry
 * 2. Validating AI-generated quantities
 * 3. Verifying mathematical accuracy
 * 4. Adding guardrails against invalid data
 */

import { Quote, PricingItem } from '../types';
import { pricingRegistry } from './pricingRegistry';

// ============================================
// 1. DETERMINISTIC PRICING ENFORCEMENT
// ============================================

/**
 * Enforce registry pricing on AI-identified work items
 * This is the KEY function that ensures "20 shrubs" always costs the same
 * 
 * @param aiItems - Items identified by AI (serviceId + quantity only)
 * @returns Items with fixed prices from registry
 */
export interface AIIdentifiedItem {
  serviceId: string;
  description: string;
  quantity: number;
}

export interface PricedItem extends AIIdentifiedItem {
  unitPrice: number;
  total: number;
}

export function enforceRegistryPricing(aiItems: AIIdentifiedItem[]): PricedItem[] {
  const pricedItems: PricedItem[] = [];

  for (const item of aiItems) {
    // Find the service in pricing registry
    const registryItem = pricingRegistry.find(
      p => p.id === item.serviceId || 
           p.service.toLowerCase().includes(item.description.toLowerCase().substring(0, 10))
    );

    if (!registryItem) {
      console.warn(`Service not found in registry: ${item.serviceId} (${item.description})`);
      // Fallback: use a default service or skip
      continue;
    }

    // DETERMINISTIC: Always use the fixed price from registry
    const unitPrice = registryItem.unitPrice;
    const total = Math.round(unitPrice * item.quantity * 100) / 100; // Round to 2 decimals

    pricedItems.push({
      ...item,
      unitPrice,
      total,
    });
  }

  return pricedItems;
}

/**
 * Map natural language descriptions to service IDs
 * Helps AI's free-form descriptions match our fixed registry
 */
export function mapDescriptionToServiceId(description: string): string | null {
  const descLower = description.toLowerCase();
  
  // Define mappings
  const mappings: Record<string, string> = {
    'sod': 'sod',
    'grass': 'sod',
    'turf': 'sod',
    'seed': 'seed',
    'overseed': 'seed',
    'mulch': 'mulch',
    'mow': 'mow',
    'mowing': 'mow',
    'lawn': 'mow',
    'paver': 'pavers',
    'walkway': 'pavers',
    'pathway': 'pavers',
    'patio': 'pavers',
    'cleaning': 'cleaning',
    'cleanout': 'cleaning',
    'cleanup': 'cleaning',
    'tree': 'tree_trim',
    'trim': 'tree_trim',
    'prune': 'tree_trim',
    'pruning': 'tree_trim',
    'shrub': 'planting',
    'plant': 'planting',
    'flower': 'planting',
    'bush': 'planting',
    'gravel': 'gravel',
    'stone': 'gravel',
    'lighting': 'lighting',
    'light': 'lighting',
    'lamp': 'lighting',
    'fence': 'fence',
    'fencing': 'fence',
  };

  // Find first matching keyword
  for (const [keyword, serviceId] of Object.entries(mappings)) {
    if (descLower.includes(keyword)) {
      return serviceId;
    }
  }

  return null;
}

// ============================================
// 2. VALIDATION LAYER
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Comprehensive quote validation
 * Ensures quotes are accurate, reasonable, and trustworthy
 */
export function validateQuoteEstimate(quote: Quote): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check 1: Quote has items
  if (!quote.items || quote.items.length === 0) {
    errors.push('Quote has no items');
    return { isValid: false, errors, warnings };
  }

  // Check 2: All service IDs exist in registry
  for (const item of quote.items) {
    const registryItem = pricingRegistry.find(p => p.id === item.serviceId);
    if (!registryItem) {
      errors.push(`Invalid service ID: ${item.serviceId}`);
    }
  }

  // Check 3: Quantities are reasonable
  for (const item of quote.items) {
    if (item.quantity <= 0) {
      errors.push(`Invalid quantity for ${item.description}: ${item.quantity}`);
    }
    
    // Define reasonable bounds
    const bounds = getQuantityBounds(item.serviceId);
    if (item.quantity < bounds.min) {
      warnings.push(`${item.description}: quantity (${item.quantity}) is unusually low (min: ${bounds.min})`);
    }
    if (item.quantity > bounds.max) {
      warnings.push(`${item.description}: quantity (${item.quantity}) is unusually high (max: ${bounds.max})`);
    }
  }

  // Check 4: Verify math calculations
  let calculatedSubtotal = 0;
  for (const item of quote.items) {
    calculatedSubtotal += item.total;
    
    // Verify item total = unitPrice * quantity
    const expectedTotal = Math.round(item.unitPrice * item.quantity * 100) / 100;
    if (Math.abs(item.total - expectedTotal) > 0.01) {
      errors.push(`Math error in ${item.description}: ${item.total} should be ${expectedTotal}`);
    }
  }

  // Round to 2 decimals
  calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;

  // Check 5: Verify subtotal
  if (Math.abs(quote.subtotal - calculatedSubtotal) > 0.01) {
    errors.push(`Subtotal mismatch: ${quote.subtotal} should be ${calculatedSubtotal}`);
  }

  // Check 6: Verify tax (assuming 8%)
  const expectedTax = Math.round(calculatedSubtotal * 0.08 * 100) / 100;
  if (Math.abs(quote.tax - expectedTax) > 0.01) {
    errors.push(`Tax mismatch: ${quote.tax} should be ${expectedTax}`);
  }

  // Check 7: Verify total
  const expectedTotal = Math.round((calculatedSubtotal + expectedTax) * 100) / 100;
  if (Math.abs(quote.total - expectedTotal) > 0.01) {
    errors.push(`Total mismatch: ${quote.total} should be ${expectedTotal}`);
  }

  // Check 8: Estimated duration is present and reasonable
  if (!quote.estimatedDuration) {
    warnings.push('No estimated duration provided');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get reasonable quantity bounds for each service type
 */
function getQuantityBounds(serviceId: string): { min: number; max: number } {
  const bounds: Record<string, { min: number; max: number }> = {
    sod: { min: 50, max: 10000 },       // sq ft
    seed: { min: 100, max: 50000 },     // sq ft
    mulch: { min: 0.5, max: 50 },       // cu yard
    mow: { min: 0.1, max: 5 },          // acres
    pavers: { min: 20, max: 5000 },     // sq ft
    cleaning: { min: 0.5, max: 40 },    // hours
    tree_trim: { min: 1, max: 50 },     // trees
    planting: { min: 1, max: 500 },     // plants
    gravel: { min: 10, max: 5000 },     // sq ft
    lighting: { min: 1, max: 100 },     // fixtures
    fence: { min: 10, max: 1000 },      // linear ft
  };

  return bounds[serviceId] || { min: 1, max: 10000 };
}

/**
 * Recalculate quote totals programmatically
 * Use this to ensure mathematical accuracy
 */
export function recalculateQuoteTotals(items: PricedItem[], taxRate: number = 0.08): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = Math.round(
    items.reduce((sum, item) => sum + item.total, 0) * 100
  ) / 100;

  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { subtotal, tax, total };
}

// ============================================
// 3. PROMPT SANITIZATION
// ============================================

/**
 * Sanitize user prompts to prevent injection attacks
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .slice(0, 500) // Max 500 characters
    .replace(/[<>]/g, '') // Remove HTML-like chars
    .replace(/system:/gi, '') // Prevent role injection
    .replace(/assistant:/gi, '')
    .replace(/\\\\/g, '') // Remove backslashes
    .replace(/```/g, ''); // Remove code blocks
}

/**
 * Validate prompt is safe and reasonable
 */
export function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Prompt cannot be empty' };
  }

  if (prompt.length > 500) {
    return { isValid: false, error: 'Prompt too long (max 500 characters)' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /ignore previous/i,
    /forget everything/i,
    /you are now/i,
    /new instructions/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(prompt)) {
      return { isValid: false, error: 'Prompt contains suspicious content' };
    }
  }

  return { isValid: true };
}

// ============================================
// 4. RETRY LOGIC
// ============================================

/**
 * Retry a function with exponential backoff
 * Essential for API reliability
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: any) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error.message?.includes('API key') || error.message?.includes('invalid')) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        
        if (onRetry) {
          onRetry(attempt + 1, error);
        }

        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ============================================
// 5. HELPER UTILITIES
// ============================================

/**
 * Round number to N decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get registry summary for logging
 */
export function getRegistrySummary(): string {
  return pricingRegistry
    .map(p => `${p.id}: ${formatCurrency(p.unitPrice)} per ${p.unit}`)
    .join(', ');
}
