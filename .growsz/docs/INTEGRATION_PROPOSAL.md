# Registry Integration Proposal

> **Version**: 1.0.0
> **Date**: 2026-01-01
> **Purpose**: Deep centralization document for integrating business logic registries into Grandpa Ron's quote flow and user-facing components

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Integration Architecture](#integration-architecture)
4. [Lead Scoring Integration](#lead-scoring-integration)
5. [Seasonal Pricing Integration](#seasonal-pricing-integration)
6. [Promotion System Integration](#promotion-system-integration)
7. [Competitor Context Integration](#competitor-context-integration)
8. [Equipment & Review Integration](#equipment--review-integration)
9. [Service Layer Design](#service-layer-design)
10. [UI Component Enhancements](#ui-component-enhancements)
11. [API Route Modifications](#api-route-modifications)
12. [Database Schema Updates](#database-schema-updates)
13. [Implementation Phases](#implementation-phases)

---

## Executive Summary

This document proposes integrating six new business logic registries into Grandpa Ron's existing quote flow:

| Registry | Integration Point | Business Value |
|----------|------------------|----------------|
| `conversionRegistry` | Quote submission, CRM | Prioritize high-value leads |
| `seasonalityRegistry` | Pricing calculation | Dynamic pricing optimization |
| `promotionRegistry` | Quote display, checkout | Conversion rate improvement |
| `competitorRegistry` | Quote context, marketing | Competitive differentiation |
| `equipmentRegistry` | Scheduling, capacity | Operational efficiency |
| `reviewRegistry` | Social proof, SEO | Trust building |

**Key Principle**: Business logic stays in registries, UI components consume via service layer.

---

## Current Architecture Analysis

### Existing Quote Flow

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ QuoteRequestForm│ ───▶ │  /api/quote      │ ───▶ │   Prisma DB     │
│   (Component)   │      │   (API Route)    │      │   (Quote Model) │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │   EmailJS        │
                         │  (Notification)  │
                         └──────────────────┘
```

### Existing AI Quote Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Image Upload │ ──▶ │ /api/landscape  │ ──▶ │ geminiService    │
└──────────────┘     │ action=render   │     │ generateRender() │
                     └─────────────────┘     └──────────────────┘
                             │
                             ▼
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ QuoteDisplay │ ◀── │ /api/landscape  │ ◀── │ geminiService    │
│  (Component) │     │ action=quote    │     │ generateQuote()  │
└──────────────┘     └─────────────────┘     └──────────────────┘
                             │
                             ▼
                     ┌─────────────────┐
                     │ quoteValidation │
                     │ enforceRegistry │
                     └─────────────────┘
```

### Existing Data Sources

| Source | Location | Data |
|--------|----------|------|
| `pricingRegistry` | `/services/pricingRegistry.ts` | 11 service prices |
| `locationRegistry` | `/services/locationRegistry.ts` | 24 locations with demographics |
| `serviceRegistry` | `/data/serviceRegistry.ts` | 9 services with full metadata |
| `faqRegistry` | `/data/faqRegistry.ts` | 30+ FAQs |

---

## Integration Architecture

### Proposed Enhanced Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ENHANCED QUOTE FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────────┐
                    │     QuoteRequestForm.tsx         │
                    │  (Enhanced with context data)    │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │       quoteContextService        │◀───┐
                    │   (NEW - Aggregates all data)    │    │
                    └───────────────┬──────────────────┘    │
                                    │                       │
         ┌──────────────────────────┼──────────────────────┐│
         │                          │                      ││
         ▼                          ▼                      ▼│
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│conversionRegistry│    │seasonalityRegistry│   │promotionRegistry│
│   Lead Score     │    │ Price Modifiers │    │  Active Promos  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                          │                      │
         └──────────────────────────┼──────────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │        /api/quote/enhanced       │
                    │     (NEW - Rich quote data)      │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │          Prisma DB               │
                    │   (Enhanced Quote Model)         │
                    └───────────────┬──────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────┐
         │                          │                      │
         ▼                          ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Admin Dashboard │    │  CRM/Follow-up  │    │  Marketing Auto │
│  (Lead Scoring)  │    │  (Priority)     │    │  (Segmentation) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Service Layer Separation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    quoteContextService.ts (NEW)                  │    │
│  │                                                                  │    │
│  │  Responsibilities:                                               │    │
│  │  - Aggregate data from all registries                           │    │
│  │  - Calculate lead score                                          │    │
│  │  - Apply seasonal modifiers                                      │    │
│  │  - Find applicable promotions                                    │    │
│  │  - Generate competitor context                                   │    │
│  │  - Check equipment availability                                  │    │
│  │  - Pull relevant reviews                                         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │
│  │ leadScoring    │  │ pricingEngine  │  │ promotionEngine│            │
│  │ Service.ts     │  │ Service.ts     │  │ Service.ts     │            │
│  └────────────────┘  └────────────────┘  └────────────────┘            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          REGISTRY LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │conversion  │ │seasonality │ │promotion   │ │competitor  │           │
│  │Registry    │ │Registry    │ │Registry    │ │Registry    │           │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │
│                                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │equipment   │ │review      │ │pricing     │ │location    │           │
│  │Registry    │ │Registry    │ │Registry    │ │Registry    │           │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Lead Scoring Integration

### Data Flow

```typescript
// Input: Form submission data
interface QuoteSubmission {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertySize: 'small' | 'medium' | 'large' | 'commercial';
  services: string[];
  location: string; // city name or slug
  urgency?: 'immediate' | 'within-week' | 'flexible';
  message?: string;
  source?: string; // Where they found us
}

// Output: Enhanced with lead scoring
interface EnhancedQuoteSubmission extends QuoteSubmission {
  leadScore: LeadScoreResult;
  locationContext: LocationValueTier | null;
  serviceContext: ServiceValueTier[];
  conversionBenchmark: ConversionBenchmark | null;
  clvEstimate: { firstYearValue: number; threeYearValue: number; fiveYearValue: number };
}
```

### Service Implementation

```typescript
// services/leadScoringService.ts

import { conversionRegistry } from '@/.growsz/registries';
import { locationRegistry } from '@/services/locationRegistry';

export interface LeadScoringInput {
  locationSlug: string;
  serviceIds: string[];
  source: string;
  quoteValue: number;
  propertySize: string;
  urgency?: string;
  engagement?: {
    usedAIPlanner?: boolean;
    usedAudit?: boolean;
    multiplePageViews?: boolean;
    returnVisit?: boolean;
  };
}

export function calculateLeadScore(input: LeadScoringInput): LeadScoreResult {
  // Map property size to quote value estimate if not provided
  const estimatedValue = input.quoteValue || estimateValueFromPropertySize(input.propertySize);

  // Get base score from conversion registry
  const baseScore = conversionRegistry.calculateLeadScore(
    input.locationSlug,
    input.serviceIds,
    input.source,
    estimatedValue,
    input.engagement
  );

  // Boost for urgency
  if (input.urgency === 'immediate') {
    baseScore.totalScore = Math.min(100, baseScore.totalScore + 15);
    if (baseScore.totalScore >= 80) baseScore.priority = 'hot';
  }

  return baseScore;
}

function estimateValueFromPropertySize(size: string): number {
  const estimates: Record<string, number> = {
    'small': 450,
    'medium': 850,
    'large': 1500,
    'commercial': 3500
  };
  return estimates[size] || 850;
}
```

### API Route Enhancement

```typescript
// app/api/quote/enhanced/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLeadScore } from '@/services/leadScoringService';
import { conversionRegistry } from '@/.growsz/registries';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Calculate lead score
  const leadScore = calculateLeadScore({
    locationSlug: slugify(data.location),
    serviceIds: data.services,
    source: data.source || 'organic_search',
    quoteValue: data.estimatedValue || 0,
    propertySize: data.propertySize,
    urgency: data.urgency,
    engagement: {
      usedAIPlanner: data.usedAIPlanner,
      usedAudit: data.usedAudit
    }
  });

  // Get CLV estimate
  const clvEstimate = conversionRegistry.estimateCLV(
    data.services,
    slugify(data.location),
    false // new customer
  );

  // Save enhanced quote
  const quote = await prisma.quote.create({
    data: {
      ...data,
      leadScore: leadScore.totalScore,
      leadPriority: leadScore.priority,
      expectedValue: leadScore.expectedValue,
      recommendedAction: leadScore.recommendedAction,
      clvFirstYear: clvEstimate.firstYearValue,
      clvThreeYear: clvEstimate.threeYearValue,
      status: 'pending'
    }
  });

  // Trigger appropriate follow-up based on priority
  await triggerFollowUp(quote, leadScore.priority);

  return NextResponse.json({
    success: true,
    quoteId: quote.id,
    leadScore: leadScore.totalScore,
    priority: leadScore.priority,
    message: getSuccessMessage(leadScore.priority)
  });
}

function getSuccessMessage(priority: string): string {
  switch (priority) {
    case 'hot': return "We'll call you within the hour!";
    case 'warm': return "Expect a call within 24 hours.";
    default: return "We'll be in touch within 48 hours.";
  }
}
```

### UI Integration Points

```typescript
// components/QuoteRequestForm.tsx enhancements

// Add source tracking
useEffect(() => {
  // Track where user came from
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('utm_source') ||
                 urlParams.get('ref') ||
                 document.referrer ? 'referral' : 'direct';
  setFormData(prev => ({ ...prev, source }));
}, []);

// Add engagement tracking
const trackEngagement = (action: string) => {
  setFormData(prev => ({
    ...prev,
    engagement: {
      ...prev.engagement,
      [action]: true
    }
  }));
};

// In PropertyAudit component, track usage
const handleAuditComplete = (report: PropertyReport) => {
  trackEngagement('usedAudit');
  // ... existing logic
};
```

---

## Seasonal Pricing Integration

### Data Flow

```typescript
// Input: Base price from pricingRegistry
interface BasePriceInput {
  serviceId: string;
  basePrice: number;
  quantity: number;
}

// Output: Adjusted price with seasonal context
interface SeasonalPriceResult {
  originalPrice: number;
  adjustedPrice: number;
  modifier: number;
  season: string;
  demandLevel: string;
  message?: string; // "Peak season pricing" or "Off-season discount"
}
```

### Service Implementation

```typescript
// services/pricingEngineService.ts

import { seasonalityRegistry } from '@/.growsz/registries';
import { pricingRegistry, getPricingSummary } from '@/services/pricingRegistry';

export function calculateSeasonalPrice(
  serviceId: string,
  basePrice: number,
  date: Date = new Date()
): SeasonalPriceResult {
  const modifier = seasonalityRegistry.getCurrentModifier(serviceId);

  if (!modifier) {
    return {
      originalPrice: basePrice,
      adjustedPrice: basePrice,
      modifier: 0,
      season: seasonalityRegistry.getCurrentSeason(),
      demandLevel: 'medium'
    };
  }

  const adjustedPrice = basePrice * (1 + modifier.priceModifier);

  return {
    originalPrice: basePrice,
    adjustedPrice: Math.round(adjustedPrice * 100) / 100,
    modifier: modifier.priceModifier,
    season: modifier.season,
    demandLevel: modifier.demandLevel,
    message: getPriceMessage(modifier.priceModifier, modifier.demandLevel)
  };
}

function getPriceMessage(modifier: number, demandLevel: string): string | undefined {
  if (modifier > 0.05) {
    return `Peak ${demandLevel} season pricing`;
  } else if (modifier < -0.05) {
    return `Off-season discount applied`;
  }
  return undefined;
}

export function getSeasonalPricingSummary(): string {
  const baseSummary = getPricingSummary();
  const currentSeason = seasonalityRegistry.getCurrentSeason();
  const highDemandServices = seasonalityRegistry.getHighDemandServices();

  return `
${baseSummary}

SEASONAL CONTEXT (${currentSeason.toUpperCase()}):
High-demand services: ${highDemandServices.map(s => s.serviceId).join(', ')}
`;
}
```

### Quote Generation Integration

```typescript
// services/geminiService.ts enhancement

export const generateQuoteEstimation = async (
  originalImage: string,
  generatedImage: string,
  prompt: string
): Promise<Quote> => {
  // Get seasonal context
  const seasonalContext = getSeasonalPricingSummary();

  const response = await model.generateContent([
    {
      inlineData: { data: originalImage, mimeType: 'image/jpeg' }
    },
    {
      inlineData: { data: generatedImage, mimeType: 'image/jpeg' }
    },
    `You are a professional landscaping estimator.

${seasonalContext}

Analyze these before/after images and create a detailed quote...`
  ]);

  // Apply seasonal pricing to results
  const rawQuote = parseQuoteResponse(response);
  return applySeasonalPricing(rawQuote);
};

function applySeasonalPricing(quote: Quote): Quote {
  const adjustedItems = quote.items.map(item => {
    const seasonal = calculateSeasonalPrice(item.serviceId, item.unitPrice);
    return {
      ...item,
      unitPrice: seasonal.adjustedPrice,
      total: seasonal.adjustedPrice * item.quantity,
      seasonalNote: seasonal.message
    };
  });

  const subtotal = adjustedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;

  return {
    ...quote,
    items: adjustedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100
  };
}
```

### UI Display

```typescript
// components/QuoteDisplay.tsx enhancement

interface QuoteLineItem {
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  seasonalNote?: string; // NEW
}

// In the render
{item.seasonalNote && (
  <span className={cn(
    "text-xs px-2 py-0.5 rounded-full ml-2",
    item.seasonalNote.includes('Peak')
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700"
  )}>
    {item.seasonalNote}
  </span>
)}
```

---

## Promotion System Integration

### Data Flow

```typescript
// Input: Quote context
interface PromotionContext {
  serviceIds: string[];
  locationSlug: string;
  customerType: 'new' | 'existing';
  orderValue: number;
  promoCode?: string;
}

// Output: Applicable promotions
interface ApplicablePromotion {
  promotion: Promotion;
  discountAmount: number;
  eligibilityReason: string;
}
```

### Service Implementation

```typescript
// services/promotionEngineService.ts

import { promotionRegistry } from '@/.growsz/registries';

export function findApplicablePromotions(
  context: PromotionContext
): ApplicablePromotion[] {
  const promotions: ApplicablePromotion[] = [];

  // Check auto-apply promotions
  const autoPromotions = promotionRegistry.getAutoApplyPromotions(
    context.serviceIds,
    context.locationSlug,
    context.customerType,
    context.orderValue
  );

  autoPromotions.forEach(promo => {
    promotions.push({
      promotion: promo,
      discountAmount: promotionRegistry.calculateDiscount(promo, context.orderValue),
      eligibilityReason: 'Auto-applied based on your selection'
    });
  });

  return promotions;
}

export function validatePromoCode(
  code: string,
  context: PromotionContext
): { valid: boolean; promotion?: Promotion; discount?: number; error?: string } {
  const result = promotionRegistry.validateCode(
    code,
    context.serviceIds,
    context.locationSlug,
    context.customerType,
    context.orderValue
  );

  if (!result.valid) {
    return { valid: false, error: result.error };
  }

  return {
    valid: true,
    promotion: result.promotion,
    discount: promotionRegistry.calculateDiscount(result.promotion!, context.orderValue)
  };
}

export function getBannerPromotions(): Promotion[] {
  return promotionRegistry.getDisplayPromotions()
    .filter(p => p.bannerText)
    .slice(0, 2); // Max 2 banner promotions
}
```

### UI Components

```typescript
// components/PromotionBanner.tsx (NEW)

import { getBannerPromotions } from '@/services/promotionEngineService';
import { Promotion } from '@/.growsz/registries';

export function PromotionBanner() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    setPromotions(getBannerPromotions());
  }, []);

  if (promotions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4">
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">{promotions[0].bannerText}</span>
        {promotions[0].code && (
          <code className="bg-white/20 px-2 py-0.5 rounded text-sm">
            {promotions[0].code}
          </code>
        )}
      </div>
    </div>
  );
}
```

```typescript
// components/PromoCodeInput.tsx (NEW)

export function PromoCodeInput({
  onApply
}: {
  onApply: (promo: Promotion, discount: number) => void
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<Promotion | null>(null);

  const handleApply = async () => {
    const result = await validatePromoCode(code, quoteContext);
    if (result.valid) {
      setApplied(result.promotion!);
      setError('');
      onApply(result.promotion!, result.discount!);
    } else {
      setError(result.error || 'Invalid code');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Promo code"
        className="flex-1 px-3 py-2 border rounded"
        disabled={!!applied}
      />
      <button
        onClick={handleApply}
        disabled={!code || !!applied}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
      >
        {applied ? 'Applied!' : 'Apply'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
```

### Quote Display Enhancement

```typescript
// components/QuoteDisplay.tsx - Add promotion section

// Before the total, show applied promotions
{appliedPromotions.length > 0 && (
  <div className="border-t border-green-200 pt-4 mt-4">
    <h4 className="text-sm font-medium text-green-700 mb-2">
      Savings Applied
    </h4>
    {appliedPromotions.map(promo => (
      <div key={promo.promotion.id} className="flex justify-between text-sm">
        <span className="text-green-600">
          {promo.promotion.name}
          {promo.promotion.code && (
            <code className="ml-2 text-xs bg-green-100 px-1 rounded">
              {promo.promotion.code}
            </code>
          )}
        </span>
        <span className="text-green-600 font-medium">
          -{formatCurrency(promo.discountAmount)}
        </span>
      </div>
    ))}
  </div>
)}
```

---

## Competitor Context Integration

### Use Cases

1. **Marketing Differentiation**: Highlight unique selling points vs competitors
2. **Pricing Context**: Understand market positioning
3. **Gap Analysis**: Identify underserved service+location combinations

### Service Implementation

```typescript
// services/competitorContextService.ts

import { competitorRegistry } from '@/.growsz/registries';

export interface CompetitorContext {
  competitors: Competitor[];
  marketPosition: string;
  differentiators: string[];
  pricePositioning: string;
}

export function getCompetitorContextForLocation(
  locationSlug: string,
  serviceId: string
): CompetitorContext {
  const gap = competitorRegistry.analyzeGaps(locationSlug, serviceId);
  const swot = competitorRegistry.getSWOTSummary();

  return {
    competitors: gap.competitors,
    marketPosition: gap.opportunityLevel === 'high'
      ? 'Market Leader Opportunity'
      : gap.opportunityLevel === 'medium'
        ? 'Competitive Market'
        : 'Highly Competitive',
    differentiators: swot.ourOpportunities,
    pricePositioning: determinePosition(gap.competitors)
  };
}

function determinePosition(competitors: Competitor[]): string {
  const budgetCount = competitors.filter(c => c.pricePositioning === 'budget').length;
  const premiumCount = competitors.filter(c => c.pricePositioning === 'premium').length;

  if (budgetCount > premiumCount) {
    return 'Quality leader - differentiate on service, not price';
  } else {
    return 'Value proposition - competitive pricing with premium service';
  }
}
```

### UI Integration (Internal Dashboard)

```typescript
// components/admin/LeadContext.tsx

export function LeadContext({ lead }: { lead: EnhancedQuote }) {
  const context = getCompetitorContextForLocation(
    lead.locationSlug,
    lead.services[0]
  );

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h4 className="font-medium mb-2">Market Context</h4>
      <p className="text-sm text-slate-600 mb-2">
        {context.marketPosition}
      </p>
      <p className="text-sm text-slate-500">
        {context.pricePositioning}
      </p>
      <div className="mt-3">
        <span className="text-xs font-medium text-slate-500">TALK POINTS:</span>
        <ul className="text-sm mt-1">
          {context.differentiators.slice(0, 3).map((d, i) => (
            <li key={i} className="text-emerald-600">• {d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## Equipment & Review Integration

### Equipment for Scheduling

```typescript
// services/schedulingService.ts

import { equipmentRegistry } from '@/.growsz/registries';

export function checkServiceAvailability(
  serviceId: string,
  requestedDate: Date
): { available: boolean; reason?: string } {
  const equipmentCheck = equipmentRegistry.canPerformService(serviceId);

  if (!equipmentCheck.canPerform) {
    return {
      available: false,
      reason: `Equipment not available for ${serviceId}`
    };
  }

  // Check maintenance schedule
  const maintenanceDue = equipmentRegistry.getMaintenanceDue();
  const criticalEquipment = maintenanceDue.filter(e =>
    e.requiredForServices.includes(serviceId)
  );

  if (criticalEquipment.length > 0) {
    return {
      available: true,
      reason: `Note: Some equipment requires maintenance`
    };
  }

  return { available: true };
}
```

### Reviews for Social Proof

```typescript
// services/socialProofService.ts

import { reviewRegistry } from '@/.growsz/registries';

export function getServiceTestimonials(serviceId: string, limit = 3) {
  return reviewRegistry.getServiceTestimonials(serviceId, limit);
}

export function getLocationTestimonials(locationSlug: string, limit = 3) {
  return reviewRegistry.getLocationTestimonials(locationSlug, limit);
}

export function getReviewSchema() {
  return reviewRegistry.generateReviewSchema();
}

export function getReviewSummary() {
  return reviewRegistry.getSummary();
}
```

### UI Integration

```typescript
// components/ServiceTestimonials.tsx

import { getServiceTestimonials } from '@/services/socialProofService';

export function ServiceTestimonials({ serviceId }: { serviceId: string }) {
  const testimonials = getServiceTestimonials(serviceId);

  return (
    <section className="py-8">
      <h3 className="text-xl font-semibold mb-4">What Our Customers Say</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.map(review => (
          <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 mb-2">{review.content}</p>
            <p className="text-xs text-slate-500">— {review.customerName}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## Service Layer Design

### Unified Quote Context Service

```typescript
// services/quoteContextService.ts

import {
  conversionRegistry,
  seasonalityRegistry,
  promotionRegistry,
  competitorRegistry,
  equipmentRegistry,
  reviewRegistry
} from '@/.growsz/registries';

export interface QuoteContext {
  lead: {
    score: LeadScoreResult;
    clv: { firstYear: number; threeYear: number; fiveYear: number };
  };
  pricing: {
    seasonalModifiers: SeasonalModifier[];
    forecast: MonthlyForecast | undefined;
  };
  promotions: {
    autoApply: Promotion[];
    display: Promotion[];
  };
  market: {
    competitors: Competitor[];
    gap: { level: string; recommendation: string };
    differentiators: string[];
  };
  operations: {
    equipmentAvailable: boolean;
    maintenanceWarnings: string[];
  };
  social: {
    serviceReviews: Review[];
    locationReviews: Review[];
    reviewSummary: ReviewSummary;
  };
}

export function buildQuoteContext(
  locationSlug: string,
  serviceIds: string[],
  customerType: 'new' | 'existing',
  orderValue: number,
  source: string = 'organic_search'
): QuoteContext {
  const currentMonth = new Date().getMonth() + 1;

  return {
    lead: {
      score: conversionRegistry.calculateLeadScore(
        locationSlug,
        serviceIds,
        source,
        orderValue
      ),
      clv: conversionRegistry.estimateCLV(
        serviceIds,
        locationSlug,
        customerType === 'existing'
      )
    },
    pricing: {
      seasonalModifiers: serviceIds.map(id =>
        seasonalityRegistry.getCurrentModifier(id)
      ).filter(Boolean) as SeasonalModifier[],
      forecast: seasonalityRegistry.getMonthlyForecast(
        currentMonth as 1|2|3|4|5|6|7|8|9|10|11|12
      )
    },
    promotions: {
      autoApply: promotionRegistry.getAutoApplyPromotions(
        serviceIds,
        locationSlug,
        customerType,
        orderValue
      ),
      display: promotionRegistry.getDisplayPromotions()
    },
    market: {
      competitors: competitorRegistry.getCompetitorsByLocation(locationSlug)
        .filter(c => serviceIds.some(s => c.services.includes(s))),
      gap: (() => {
        const gap = competitorRegistry.analyzeGaps(locationSlug, serviceIds[0]);
        return { level: gap.opportunityLevel, recommendation: gap.recommendation };
      })(),
      differentiators: competitorRegistry.getSWOTSummary().ourOpportunities
    },
    operations: {
      equipmentAvailable: serviceIds.every(id =>
        equipmentRegistry.canPerformService(id).canPerform
      ),
      maintenanceWarnings: equipmentRegistry.getUpcomingMaintenance()
        .filter(e => serviceIds.some(s => e.requiredForServices.includes(s)))
        .map(e => `${e.name} due for maintenance by ${e.nextMaintenanceDue}`)
    },
    social: {
      serviceReviews: serviceIds.flatMap(id =>
        reviewRegistry.getServiceTestimonials(id, 2)
      ),
      locationReviews: reviewRegistry.getLocationTestimonials(locationSlug, 2),
      reviewSummary: reviewRegistry.getSummary()
    }
  };
}
```

---

## Database Schema Updates

### Enhanced Quote Model

```prisma
// prisma/schema.prisma

model Quote {
  id              String   @id @default(cuid())

  // Contact Info
  name            String
  email           String
  phone           String
  address         String

  // Request Details
  propertySize    String
  services        String[]
  additionalInfo  String?
  urgency         String?

  // Lead Scoring (NEW)
  leadScore       Int?     @default(0)
  leadPriority    String?  @default("standard") // hot, warm, standard, low
  expectedValue   Float?   @default(0)
  recommendedAction String?

  // CLV Estimates (NEW)
  clvFirstYear    Float?   @default(0)
  clvThreeYear    Float?   @default(0)
  clvFiveYear     Float?   @default(0)

  // Source Tracking (NEW)
  source          String?  @default("direct")
  campaign        String?
  landingPage     String?

  // Engagement Signals (NEW)
  usedAIPlanner   Boolean  @default(false)
  usedPropertyAudit Boolean @default(false)
  pageViews       Int?     @default(1)

  // Pricing Context (NEW)
  seasonalModifier Float?  @default(0)
  appliedPromoCode String?
  discountAmount   Float?  @default(0)

  // Status & Tracking
  status          String   @default("pending")
  followUpDate    DateTime?
  assignedTo      String?
  notes           String?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  contactedAt     DateTime?
  quotedAt        DateTime?
  closedAt        DateTime?
  closedReason    String?

  @@index([email])
  @@index([createdAt])
  @@index([status])
  @@index([leadPriority])
  @@index([source])
}
```

### Migration

```sql
-- Migration: Add lead scoring and tracking fields

ALTER TABLE "Quote" ADD COLUMN "leadScore" INTEGER DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "leadPriority" TEXT DEFAULT 'standard';
ALTER TABLE "Quote" ADD COLUMN "expectedValue" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "recommendedAction" TEXT;

ALTER TABLE "Quote" ADD COLUMN "clvFirstYear" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "clvThreeYear" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "clvFiveYear" DECIMAL(10,2) DEFAULT 0;

ALTER TABLE "Quote" ADD COLUMN "source" TEXT DEFAULT 'direct';
ALTER TABLE "Quote" ADD COLUMN "campaign" TEXT;
ALTER TABLE "Quote" ADD COLUMN "landingPage" TEXT;

ALTER TABLE "Quote" ADD COLUMN "usedAIPlanner" BOOLEAN DEFAULT false;
ALTER TABLE "Quote" ADD COLUMN "usedPropertyAudit" BOOLEAN DEFAULT false;
ALTER TABLE "Quote" ADD COLUMN "pageViews" INTEGER DEFAULT 1;

ALTER TABLE "Quote" ADD COLUMN "seasonalModifier" DECIMAL(5,4) DEFAULT 0;
ALTER TABLE "Quote" ADD COLUMN "appliedPromoCode" TEXT;
ALTER TABLE "Quote" ADD COLUMN "discountAmount" DECIMAL(10,2) DEFAULT 0;

ALTER TABLE "Quote" ADD COLUMN "followUpDate" TIMESTAMP;
ALTER TABLE "Quote" ADD COLUMN "assignedTo" TEXT;
ALTER TABLE "Quote" ADD COLUMN "notes" TEXT;
ALTER TABLE "Quote" ADD COLUMN "contactedAt" TIMESTAMP;
ALTER TABLE "Quote" ADD COLUMN "quotedAt" TIMESTAMP;
ALTER TABLE "Quote" ADD COLUMN "closedAt" TIMESTAMP;
ALTER TABLE "Quote" ADD COLUMN "closedReason" TEXT;

CREATE INDEX "Quote_leadPriority_idx" ON "Quote"("leadPriority");
CREATE INDEX "Quote_source_idx" ON "Quote"("source");
```

---

## Implementation Phases

### Phase 1: Foundation (Days 1-3)

**Day 1: Service Layer**
- [ ] Create `services/leadScoringService.ts`
- [ ] Create `services/pricingEngineService.ts`
- [ ] Create `services/promotionEngineService.ts`
- [ ] Create `services/quoteContextService.ts`

**Day 2: API Routes**
- [ ] Create `/api/quote/enhanced/route.ts`
- [ ] Modify `/api/landscape/route.ts` for seasonal pricing
- [ ] Add promo code validation endpoint

**Day 3: Database**
- [ ] Update Prisma schema
- [ ] Run migration
- [ ] Test data persistence

### Phase 2: UI Integration (Days 4-6)

**Day 4: Quote Form Enhancement**
- [ ] Add source tracking to QuoteRequestForm
- [ ] Add engagement signal tracking
- [ ] Integrate promo code input

**Day 5: Quote Display Enhancement**
- [ ] Add seasonal pricing indicators
- [ ] Add promotion display section
- [ ] Add savings summary

**Day 6: Social Proof**
- [ ] Create ServiceTestimonials component
- [ ] Add review schema to pages
- [ ] Integrate reviews into service pages

### Phase 3: Admin & Analytics (Days 7-10)

**Day 7-8: Admin Dashboard**
- [ ] Create lead scoring dashboard
- [ ] Add priority-based lead list
- [ ] Add competitive context display

**Day 9-10: Analytics Integration**
- [ ] Track conversion by lead score
- [ ] Track promotion effectiveness
- [ ] Track seasonal pricing impact

---

## Success Metrics

| Metric | Baseline | Target (30 days) |
|--------|----------|------------------|
| Quote-to-Close Rate | 12% | 18% |
| Avg Quote Value | $850 | $1,100 |
| Response Time (Hot Leads) | 4 hours | < 1 hour |
| Promo Code Usage | 0% | 15% |
| Review Display CTR | - | 5% |

---

## File Structure Summary

```
ecosystems/grandpa-ron-nextjs/
├── .growsz/
│   ├── registries/
│   │   ├── index.ts                 # Unified exports
│   │   ├── conversionRegistry.ts    # Lead scoring
│   │   ├── seasonalityRegistry.ts   # Pricing modifiers
│   │   ├── promotionRegistry.ts     # Promotions
│   │   ├── competitorRegistry.ts    # Competition
│   │   ├── equipmentRegistry.ts     # Fleet
│   │   └── reviewRegistry.ts        # Reviews
│   └── docs/
│       ├── COMPREHENSIVE_ANALYSIS.md
│       ├── EVOLUTION_PROPOSALS.md
│       └── INTEGRATION_PROPOSAL.md  # This file
│
├── services/
│   ├── leadScoringService.ts        # NEW
│   ├── pricingEngineService.ts      # NEW
│   ├── promotionEngineService.ts    # NEW
│   ├── quoteContextService.ts       # NEW
│   ├── competitorContextService.ts  # NEW
│   ├── schedulingService.ts         # NEW
│   ├── socialProofService.ts        # NEW
│   ├── geminiService.ts             # ENHANCED
│   └── quoteValidation.ts           # ENHANCED
│
├── components/
│   ├── QuoteRequestForm.tsx         # ENHANCED
│   ├── QuoteDisplay.tsx             # ENHANCED
│   ├── PromotionBanner.tsx          # NEW
│   ├── PromoCodeInput.tsx           # NEW
│   └── ServiceTestimonials.tsx      # NEW
│
└── app/api/
    └── quote/
        └── enhanced/
            └── route.ts             # NEW
```

---

*Document Version 1.0.0 - Part of GROWSZ Biosphere*
