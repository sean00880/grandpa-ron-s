/**
 * PROMOTION REGISTRY
 * Promotional offers, discounts, and marketing campaigns
 *
 * Purpose: Manage time-limited offers, track campaign effectiveness
 * Usage: Quote system integration, marketing calendar, A/B testing
 */

export type PromotionType = 'percentage' | 'fixed' | 'bundle' | 'free-addon' | 'referral';
export type PromotionStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'expired';

export interface Promotion {
  id: string;
  name: string;
  internalName: string;
  type: PromotionType;
  value: number; // Percentage (0.10 = 10%) or fixed amount in dollars
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: PromotionStatus;

  // Eligibility
  applicableServices: string[] | 'all';
  applicableLocations: string[] | 'all';
  customerType: 'new' | 'existing' | 'all';
  minOrderValue?: number;
  maxDiscount?: number;

  // Display
  code?: string; // Optional promo code
  autoApply: boolean;
  displayOnSite: boolean;
  bannerText?: string;
  description: string;
  terms: string;

  // Limits
  maxRedemptions?: number;
  redemptionsCount: number;
  maxPerCustomer: number;

  // Tracking
  source: string;
  campaign?: string;
  createdAt: string;
  updatedAt: string;
}

const promotions: Promotion[] = [
  // ============================================
  // SEASONAL PROMOTIONS
  // ============================================
  {
    id: 'spring-early-bird-2026',
    name: 'Spring Early Bird Special',
    internalName: 'spring_early_bird_2026',
    type: 'percentage',
    value: 0.10, // 10% off
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    status: 'scheduled',
    applicableServices: ['mulching', 'landscaping', 'spring-cleanup'],
    applicableLocations: 'all',
    customerType: 'all',
    minOrderValue: 200,
    code: 'SPRING26',
    autoApply: false,
    displayOnSite: true,
    bannerText: 'Early Bird Special: 10% off mulching & landscaping through March 15!',
    description: 'Book your spring services early and save 10%! Valid on mulching, landscaping, and spring cleanup.',
    terms: 'Valid for services scheduled by May 31, 2026. Cannot be combined with other offers. $200 minimum order.',
    maxRedemptions: 100,
    redemptionsCount: 0,
    maxPerCustomer: 1,
    source: 'website',
    campaign: 'spring-2026',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'fall-aeration-2026',
    name: 'Fall Aeration & Seeding Package',
    internalName: 'fall_aeration_pkg_2026',
    type: 'bundle',
    value: 75, // $75 savings on bundle
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    status: 'draft',
    applicableServices: ['overseeding', 'aeration'],
    applicableLocations: 'all',
    customerType: 'all',
    autoApply: true,
    displayOnSite: true,
    bannerText: 'Fall Special: Aeration + Overseeding - Save $75!',
    description: 'Get both aeration and overseeding together and save $75. Best time for lawn renovation!',
    terms: 'Services must be performed together. Valid August 15 - October 15, 2026.',
    maxPerCustomer: 1,
    redemptionsCount: 0,
    source: 'website',
    campaign: 'fall-2026',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'snow-contract-2026',
    name: 'Early Snow Contract Discount',
    internalName: 'snow_contract_early_2026',
    type: 'percentage',
    value: 0.15, // 15% off seasonal rate
    startDate: '2026-09-01',
    endDate: '2026-11-01',
    status: 'draft',
    applicableServices: ['snow-removal'],
    applicableLocations: 'all',
    customerType: 'all',
    code: 'SNOW26',
    autoApply: false,
    displayOnSite: true,
    bannerText: 'Lock in 15% off your winter snow contract - book by Nov 1!',
    description: 'Secure your spot for priority snow removal. Early contracts save 15% on seasonal rates.',
    terms: 'Valid for seasonal contracts signed by November 1, 2026. Payment plan available.',
    maxPerCustomer: 1,
    redemptionsCount: 0,
    source: 'website',
    campaign: 'snow-2026',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // ============================================
  // CUSTOMER SEGMENT PROMOTIONS
  // ============================================
  {
    id: 'new-customer-2026',
    name: 'New Customer Welcome',
    internalName: 'new_customer_welcome',
    type: 'percentage',
    value: 0.15, // 15% off first service
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    applicableServices: 'all',
    applicableLocations: 'all',
    customerType: 'new',
    code: 'WELCOME15',
    autoApply: false,
    displayOnSite: true,
    bannerText: 'New customers: 15% off your first service!',
    description: 'Welcome to the Grandpa Ron\'s family! Enjoy 15% off your first service.',
    terms: 'Valid for first-time customers only. One use per household.',
    maxPerCustomer: 1,
    redemptionsCount: 0,
    source: 'website',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'senior-discount',
    name: 'Senior Citizen Discount',
    internalName: 'senior_discount',
    type: 'percentage',
    value: 0.10, // 10% off
    startDate: '2020-01-01',
    endDate: '2030-12-31',
    status: 'active',
    applicableServices: 'all',
    applicableLocations: 'all',
    customerType: 'all',
    autoApply: false,
    displayOnSite: true,
    description: 'We appreciate our senior customers! 10% off all services for customers 65+.',
    terms: 'Must be 65 or older. Cannot be combined with other percentage discounts.',
    maxPerCustomer: 999,
    redemptionsCount: 0,
    source: 'policy',
    createdAt: '2020-01-01',
    updatedAt: '2026-01-01'
  },
  {
    id: 'veteran-discount',
    name: 'Veteran & Active Military Discount',
    internalName: 'veteran_discount',
    type: 'percentage',
    value: 0.10, // 10% off
    startDate: '2020-01-01',
    endDate: '2030-12-31',
    status: 'active',
    applicableServices: 'all',
    applicableLocations: 'all',
    customerType: 'all',
    autoApply: false,
    displayOnSite: true,
    description: 'Thank you for your service! 10% off all services for veterans and active military.',
    terms: 'Proof of service required. Cannot be combined with other percentage discounts.',
    maxPerCustomer: 999,
    redemptionsCount: 0,
    source: 'policy',
    createdAt: '2020-01-01',
    updatedAt: '2026-01-01'
  },

  // ============================================
  // REFERRAL PROMOTIONS
  // ============================================
  {
    id: 'referral-program',
    name: 'Referral Reward Program',
    internalName: 'referral_program',
    type: 'referral',
    value: 50, // $50 credit for referrer
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    applicableServices: 'all',
    applicableLocations: 'all',
    customerType: 'existing',
    autoApply: false,
    displayOnSite: true,
    bannerText: 'Refer a friend, get $50 off your next service!',
    description: 'When you refer a friend who books, you both save! You get $50 off, they get 15% off.',
    terms: 'Referred customer must complete first service. Credit applied to your next invoice.',
    maxPerCustomer: 10, // Up to $500 in referrals
    redemptionsCount: 0,
    source: 'referral_program',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // ============================================
  // BUNDLE PROMOTIONS
  // ============================================
  {
    id: 'full-service-bundle',
    name: 'Full Property Care Package',
    internalName: 'full_service_bundle',
    type: 'bundle',
    value: 150, // $150 savings
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    applicableServices: ['mowing', 'mulching', 'tree-trimming'],
    applicableLocations: 'all',
    customerType: 'all',
    autoApply: true,
    displayOnSite: true,
    description: 'Get weekly mowing + annual mulching + tree trimming. Save $150!',
    terms: 'Requires annual mowing contract. Services can be scheduled throughout the year.',
    maxPerCustomer: 1,
    minOrderValue: 1000,
    redemptionsCount: 0,
    source: 'website',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  },

  // ============================================
  // LOCATION-SPECIFIC PROMOTIONS
  // ============================================
  {
    id: 'new-albany-premium',
    name: 'New Albany Elite Service',
    internalName: 'new_albany_premium',
    type: 'free-addon',
    value: 0, // Free enhancement
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    status: 'scheduled',
    applicableServices: ['landscaping', 'hardscaping'],
    applicableLocations: ['new-albany-oh', 'upper-arlington-oh', 'bexley-oh'],
    customerType: 'all',
    minOrderValue: 5000,
    autoApply: true,
    displayOnSite: false, // VIP offer, not public
    description: 'Complimentary landscape lighting design with projects $5,000+',
    terms: 'Premium markets only. Design consultation included, installation priced separately.',
    maxPerCustomer: 1,
    redemptionsCount: 0,
    source: 'vip_program',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01'
  }
];

// ============================================
// PROMOTION REGISTRY CLASS
// ============================================

class PromotionRegistry {
  private promotions: Promotion[];

  constructor() {
    this.promotions = promotions;
  }

  /**
   * Get all promotions
   */
  getAllPromotions(): Promotion[] {
    return this.promotions;
  }

  /**
   * Get promotion by ID
   */
  getPromotionById(id: string): Promotion | undefined {
    return this.promotions.find(p => p.id === id);
  }

  /**
   * Get promotion by code
   */
  getPromotionByCode(code: string): Promotion | undefined {
    return this.promotions.find(p =>
      p.code?.toLowerCase() === code.toLowerCase() &&
      p.status === 'active'
    );
  }

  /**
   * Get active promotions
   */
  getActivePromotions(): Promotion[] {
    const now = new Date().toISOString().split('T')[0];
    return this.promotions.filter(p =>
      p.status === 'active' &&
      p.startDate <= now &&
      p.endDate >= now
    );
  }

  /**
   * Get promotions to display on site
   */
  getDisplayPromotions(): Promotion[] {
    return this.getActivePromotions().filter(p => p.displayOnSite);
  }

  /**
   * Get auto-apply promotions for a quote
   */
  getAutoApplyPromotions(
    serviceIds: string[],
    locationSlug: string,
    customerType: 'new' | 'existing',
    orderValue: number
  ): Promotion[] {
    return this.getActivePromotions().filter(p => {
      if (!p.autoApply) return false;
      if (p.minOrderValue && orderValue < p.minOrderValue) return false;
      if (p.customerType !== 'all' && p.customerType !== customerType) return false;

      // Check service eligibility
      const serviceEligible = p.applicableServices === 'all' ||
        serviceIds.some(s => (p.applicableServices as string[]).includes(s));

      // Check location eligibility
      const locationEligible = p.applicableLocations === 'all' ||
        (p.applicableLocations as string[]).includes(locationSlug);

      return serviceEligible && locationEligible;
    });
  }

  /**
   * Validate promo code
   */
  validateCode(
    code: string,
    serviceIds: string[],
    locationSlug: string,
    customerType: 'new' | 'existing',
    orderValue: number
  ): { valid: boolean; promotion?: Promotion; error?: string } {
    const promo = this.getPromotionByCode(code);

    if (!promo) {
      return { valid: false, error: 'Invalid promo code' };
    }

    const now = new Date().toISOString().split('T')[0];
    if (promo.startDate > now) {
      return { valid: false, error: 'This code is not yet active' };
    }
    if (promo.endDate < now) {
      return { valid: false, error: 'This code has expired' };
    }
    if (promo.maxRedemptions && promo.redemptionsCount >= promo.maxRedemptions) {
      return { valid: false, error: 'This code has reached maximum redemptions' };
    }
    if (promo.minOrderValue && orderValue < promo.minOrderValue) {
      return { valid: false, error: `Minimum order of $${promo.minOrderValue} required` };
    }
    if (promo.customerType !== 'all' && promo.customerType !== customerType) {
      return { valid: false, error: `This offer is for ${promo.customerType} customers only` };
    }

    // Check service eligibility
    if (promo.applicableServices !== 'all') {
      const hasEligibleService = serviceIds.some(s =>
        (promo.applicableServices as string[]).includes(s)
      );
      if (!hasEligibleService) {
        return { valid: false, error: 'Code not valid for selected services' };
      }
    }

    // Check location eligibility
    if (promo.applicableLocations !== 'all') {
      if (!(promo.applicableLocations as string[]).includes(locationSlug)) {
        return { valid: false, error: 'Code not valid for your location' };
      }
    }

    return { valid: true, promotion: promo };
  }

  /**
   * Calculate discount amount
   */
  calculateDiscount(promo: Promotion, subtotal: number): number {
    let discount = 0;

    switch (promo.type) {
      case 'percentage':
        discount = subtotal * promo.value;
        break;
      case 'fixed':
      case 'bundle':
        discount = promo.value;
        break;
      case 'referral':
        discount = promo.value;
        break;
      case 'free-addon':
        discount = 0; // Value is in the addon, not discount
        break;
    }

    // Apply max discount cap if set
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }

    return discount;
  }

  /**
   * Get promotions by campaign
   */
  getPromotionsByCampaign(campaign: string): Promotion[] {
    return this.promotions.filter(p => p.campaign === campaign);
  }

  /**
   * Get upcoming promotions (scheduled but not yet active)
   */
  getUpcomingPromotions(): Promotion[] {
    const now = new Date().toISOString().split('T')[0];
    return this.promotions.filter(p =>
      p.status === 'scheduled' || (p.status === 'active' && p.startDate > now)
    );
  }
}

export const promotionRegistry = new PromotionRegistry();
