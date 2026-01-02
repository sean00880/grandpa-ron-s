/**
 * PROMO CODE VALIDATION API ROUTE
 * Real-time promo code validation for the quote form
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validatePromoCode,
  formatPromotionDisplay,
  type PromotionContext
} from '@/services/promotionEngineService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      serviceIds = [],
      locationSlug = 'columbus',
      customerType = 'new',
      orderValue = 0
    } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    const context: PromotionContext = {
      serviceIds,
      locationSlug,
      customerType,
      orderValue
    };

    const result = validatePromoCode(code, context);

    if (result.valid && result.promotion) {
      const display = formatPromotionDisplay(result.promotion);

      return NextResponse.json({
        valid: true,
        promotion: {
          name: result.promotion.name,
          description: result.promotion.description,
          badge: display.badge,
          discountAmount: result.discountAmount,
          expiresText: display.expiresText
        }
      });
    }

    return NextResponse.json({
      valid: false,
      error: result.error || 'Invalid promo code',
      suggestion: result.suggestion
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking active promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationSlug = searchParams.get('location') || 'columbus';
    const customerType = searchParams.get('customerType') as 'new' | 'existing' || 'new';

    // Import here to avoid issues with server components
    const { getBannerPromotions, getNewCustomerPromotions, getLocationPromotions } = await import('@/services/promotionEngineService');

    const banners = getBannerPromotions();
    const locationPromos = getLocationPromotions(locationSlug);
    const newCustomerPromos = customerType === 'new' ? getNewCustomerPromotions() : [];

    // Combine and deduplicate
    const allPromos = [...banners, ...locationPromos, ...newCustomerPromos];
    const uniquePromos = Array.from(
      new Map(allPromos.map(p => [p.id, p])).values()
    );

    return NextResponse.json({
      promotions: uniquePromos.slice(0, 5).map(p => {
        const display = formatPromotionDisplay(p);
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          badge: display.badge,
          code: p.code,
          bannerText: p.bannerText,
          expiresText: display.expiresText
        };
      })
    });
  } catch (error) {
    console.error('Promo list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}
