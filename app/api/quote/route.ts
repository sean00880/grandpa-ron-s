/**
 * ENHANCED QUOTE API ROUTE
 * Integrates lead scoring, seasonality, promotions, and competitor context
 *
 * Flow:
 * 1. Validate input
 * 2. Determine location from address
 * 3. Calculate lead score
 * 4. Get seasonal pricing context
 * 5. Find applicable promotions
 * 6. Capture competitor context
 * 7. Save enhanced quote to database
 * 8. Return context for UI display
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  generateQuoteContext,
  validateQuotePromoCode,
  shouldNotifyImmediately,
  getFollowUpTimeline,
  type QuoteInput
} from '@/services';

// Location mapping from address patterns
const LOCATION_PATTERNS: Record<string, string[]> = {
  'dublin': ['dublin', '43016', '43017'],
  'powell': ['powell', '43065'],
  'delaware': ['delaware', '43015'],
  'westerville': ['westerville', '43081', '43082'],
  'upper-arlington': ['upper arlington', 'upper-arlington', '43221', '43220'],
  'worthington': ['worthington', '43085'],
  'hilliard': ['hilliard', '43026'],
  'grove-city': ['grove city', 'grove-city', '43123'],
  'gahanna': ['gahanna', '43230'],
  'new-albany': ['new albany', 'new-albany', '43054'],
  'pickerington': ['pickerington', '43147'],
  'reynoldsburg': ['reynoldsburg', '43068'],
  'columbus': ['columbus', '43201', '43202', '43203', '43204', '43205', '43206', '43207', '43209', '43210', '43211', '43212', '43213', '43214', '43215', '43219', '43222', '43223', '43224', '43227', '43228', '43229', '43231', '43232']
};

function determineLocationSlug(address: string): string {
  const normalized = address.toLowerCase();

  for (const [slug, patterns] of Object.entries(LOCATION_PATTERNS)) {
    if (patterns.some(pattern => normalized.includes(pattern))) {
      return slug;
    }
  }

  return 'columbus'; // Default fallback
}

function calculateFollowUpDate(priority: string, urgency?: string): Date {
  const now = new Date();
  const hours = (() => {
    if (priority === 'hot') return urgency === 'immediate' ? 1 : 4;
    if (priority === 'warm') return 24;
    if (priority === 'standard') return 48;
    return 168; // 1 week
  })();

  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      address,
      propertySize,
      services,
      additionalInfo,
      urgency,
      // Enhanced fields
      promoCode,
      source = 'organic',
      customerType = 'new',
      // Engagement tracking
      usedAIPlanner = false,
      usedAudit = false,
      pageViewCount = 1,
      isReturnVisit = false
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !propertySize || !services) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const serviceArray = Array.isArray(services) ? services : [services];
    const locationSlug = determineLocationSlug(address);

    // Generate enhanced quote context
    const quoteInput: QuoteInput = {
      locationSlug,
      serviceIds: serviceArray,
      source,
      propertySize,
      urgency: urgency as 'immediate' | 'within-week' | 'flexible' | undefined,
      customerType: customerType as 'new' | 'existing',
      promoCode,
      engagement: {
        usedAIPlanner,
        usedAudit,
        multiplePageViews: pageViewCount > 1,
        returnVisit: isReturnVisit
      }
    };

    const quoteContext = generateQuoteContext(quoteInput);

    // Validate promo code if provided
    let promoDiscount = 0;
    let validatedPromoCode: string | null = null;

    if (promoCode) {
      const promoResult = validateQuotePromoCode(promoCode, quoteInput);
      if (promoResult.valid && promoResult.discountAmount) {
        promoDiscount = promoResult.discountAmount;
        validatedPromoCode = promoCode;
      }
    }

    // Calculate follow-up date
    const followUpDue = calculateFollowUpDate(
      quoteContext.priority,
      urgency
    );

    // Prepare competitor context snapshot (store as JSON)
    const competitorSnapshot = {
      pricePosition: quoteContext.competitorInsights.pricePosition,
      advantages: quoteContext.competitorInsights.competitiveAdvantages,
      generatedAt: quoteContext.generatedAt
    };

    // Save enhanced quote to database
    const quote = await prisma.quote.create({
      data: {
        // Core fields
        name,
        email,
        phone,
        address,
        propertySize,
        services: serviceArray.join(','), // SQLite: comma-separated string
        additionalInfo: additionalInfo || null,
        urgency: urgency || 'flexible',
        status: 'pending',

        // Lead Scoring
        leadScore: quoteContext.leadScore.totalScore,
        leadPriority: quoteContext.priority,
        locationSlug,
        customerType,
        source,

        // Engagement
        usedAIPlanner,
        usedAudit,
        pageViewCount,
        isReturnVisit,

        // Pricing Context
        estimatedValue: quoteContext.leadScore.clvEstimate.firstYearValue,
        seasonalModifier: quoteContext.seasonalContext.pricingAdjustment,
        promoCode: validatedPromoCode,
        promoDiscount: promoDiscount > 0 ? promoDiscount : null,

        // Business Intelligence
        clvFirstYear: quoteContext.leadScore.clvEstimate.firstYearValue,
        clvThreeYear: quoteContext.leadScore.clvEstimate.threeYearValue,
        competitorContext: JSON.stringify(competitorSnapshot), // SQLite: JSON string

        // Follow-up
        recommendedAction: quoteContext.recommendedFollowUp,
        followUpDue
      }
    });

    // Determine if immediate notification is needed
    const needsImmediateNotification = shouldNotifyImmediately(quoteContext.leadScore);
    const followUpTimeline = getFollowUpTimeline(quoteContext.leadScore);

    // Return enhanced response
    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      message: 'Quote request submitted successfully',

      // Enhanced context for UI
      context: {
        leadScore: quoteContext.leadScore.totalScore,
        priority: quoteContext.priority,

        seasonal: {
          season: quoteContext.seasonalContext.currentSeason,
          demandLevel: quoteContext.seasonalContext.demandLevel,
          message: quoteContext.seasonalContext.pricingMessage
        },

        promotions: {
          applied: validatedPromoCode !== null,
          promoCode: validatedPromoCode,
          discount: promoDiscount,
          available: quoteContext.applicablePromotions.map(p => ({
            name: p.promotion.name,
            discount: p.discountAmount,
            code: p.promotion.code
          }))
        },

        socialProof: {
          rating: quoteContext.socialProof.rating,
          reviewCount: quoteContext.socialProof.reviewCount,
          trustSignals: quoteContext.socialProof.trustSignals
        },

        followUp: {
          timeline: followUpTimeline,
          needsImmediateNotification
        }
      }
    });
  } catch (error) {
    console.error('Quote submission error:', error);

    // Log error details for debugging (in production, send to monitoring)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }

    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

// GET endpoint for quote status check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('id');

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID required' },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        leadPriority: true,
        recommendedAction: true
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('Quote lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup quote' },
      { status: 500 }
    );
  }
}
