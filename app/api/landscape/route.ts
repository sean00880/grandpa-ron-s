/**
 * ENHANCED LANDSCAPE API ROUTE
 * Integrates seasonal pricing and promotional context into AI quotes
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateLandscapeRender, generateQuoteEstimation } from '@/services/geminiService';
import { getSeasonMarketingContext } from '@/services/pricingEngineService';
import { getBannerPromotions } from '@/services/promotionEngineService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      imageBase64,
      instructions,
      region,
      originalImage,
      generatedImage,
      prompt,
      // Enhanced options
      locationSlug,
      customerType = 'new',
      applySeasonalPricing = true
    } = body;

    if (action === 'render') {
      if (!imageBase64 || !instructions) {
        return NextResponse.json(
          { error: 'Missing required fields: imageBase64, instructions' },
          { status: 400 }
        );
      }

      const result = await generateLandscapeRender(imageBase64, instructions, region);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'quote') {
      if (!originalImage || !generatedImage || !prompt) {
        return NextResponse.json(
          { error: 'Missing required fields: originalImage, generatedImage, prompt' },
          { status: 400 }
        );
      }

      // Generate enhanced quote with seasonal and promotional context
      const quote = await generateQuoteEstimation(
        originalImage,
        generatedImage,
        prompt,
        {
          locationSlug: locationSlug || 'columbus',
          customerType: customerType as 'new' | 'existing',
          applySeasonalPricing
        }
      );

      // Get current seasonal context for additional UI hints
      const seasonalContext = getSeasonMarketingContext();
      const bannerPromotions = getBannerPromotions();

      return NextResponse.json({
        success: true,
        data: quote,
        // Additional context for UI
        context: {
          currentSeason: seasonalContext.season,
          highDemandServices: seasonalContext.highDemandServices.map(s => s.serviceId),
          suggestedPromotions: seasonalContext.suggestedPromotions,
          bannerPromotions: bannerPromotions.map(p => ({
            name: p.name,
            bannerText: p.bannerText,
            code: p.code
          }))
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "render" or "quote"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Landscape API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
