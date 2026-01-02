import { GoogleGenAI, Type } from "@google/genai";
import { PricingItem, Quote, PropertyReport } from "../types";
import { getPricingSummary } from "./pricingRegistry";
import {
  getSeasonalPricingSummary,
  applySeasonalPricing,
  calculateSeasonalQuoteTotals,
  getSeasonMarketingContext,
  type QuoteLineItemWithSeasonal
} from "./pricingEngineService";
import {
  findApplicablePromotions,
  formatPromotionDisplay,
  type PromotionContext
} from "./promotionEngineService";
import {
  getSocialProofPackage
} from "./socialProofService";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY });

const getBase64Data = (dataUrl: string) => {
  const base64Data = dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const mimeType = dataUrl.match(/data:image\/(png|jpeg|jpg|webp);base64/)?.[0].replace('data:', '').replace(';base64', '') || 'image/png';
  return { base64Data, mimeType };
};

// Helper to safely parse JSON that might be wrapped in Markdown code blocks
const safeJsonParse = (text: string) => {
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
};

/**
 * Generates a transformed version of the lawn image based on instructions.
 */
export const generateLandscapeRender = async (
  imageBase64: string,
  instructions: string,
  region?: { x: number, y: number, width: number, height: number }
): Promise<string> => {
  try {
    const { base64Data, mimeType } = getBase64Data(imageBase64);

    let fullPrompt = `
      You are an expert landscape architect.
      Task: Edit the provided image strictly following these instructions: "${instructions}".

      Requirements:
      1. Hyper-realistic, photorealistic quality.
      2. Maintain the EXACT perspective and lighting of the original.
      3. Focus on the grass, plants, walkways, and garden beds.
      4. Output a high-quality image.
    `;

    if (region) {
      const vPos = region.y < 33 ? "top" : region.y > 66 ? "bottom" : "middle";
      const hPos = region.x < 33 ? "left" : region.x > 66 ? "right" : "center";

      fullPrompt += `
      CRITICAL: The user has selected a specific region in the ${vPos}-${hPos} area of the image (x:${Math.round(region.x)}%, y:${Math.round(region.y)}%, w:${Math.round(region.width)}%, h:${Math.round(region.height)}%).
      Apply the changes primarily to this area, blending it naturally with the rest of the environment.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: fullPrompt },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated from Gemini.");

    for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate landscape render.");
  }
};

/**
 * Analyzes the uploaded image to suggest relevant landscaping improvements.
 */
export const analyzeImageForSuggestions = async (imageBase64: string): Promise<string[]> => {
  try {
    const { base64Data, mimeType } = getBase64Data(imageBase64);

    const prompt = `
      Analyze this yard/lawn image.
      Suggest 3 specific, distinct, and creative landscaping improvements or renovations suitable for this specific terrain and state.
      Keep suggestions short (under 10 words).
      Return ONLY a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["Fix patchiness", "Add a flower bed", "Install a pathway"];
    return safeJsonParse(text);
  } catch (error) {
    console.error("Analysis Error:", error);
    return ["Add a stone pathway", "Plant native shrubs", "Install modern lighting"];
  }
};

/**
 * Enhanced quote result with seasonal and promotional context
 */
export interface EnhancedQuote extends Quote {
  // Seasonal adjustments
  seasonalContext?: {
    season: string;
    demandLevel: string;
    adjustedItems: QuoteLineItemWithSeasonal[];
    seasonalSavings: number;
    seasonalPremium: number;
  };
  // Available promotions
  promotions?: Array<{
    name: string;
    discount: number;
    code?: string;
    badge: string;
  }>;
  // Social proof
  socialProof?: {
    rating: number;
    reviewCount: number;
  };
  // Original vs adjusted totals
  originalSubtotal?: number;
  adjustedSubtotal?: number;
}

/**
 * Generates a quote based on the transformation using the Pricing Registry.
 * Enhanced with seasonal pricing and promotional context.
 */
export const generateQuoteEstimation = async (
  originalImage: string,
  generatedImage: string,
  prompt: string,
  options?: {
    locationSlug?: string;
    customerType?: 'new' | 'existing';
    applySeasonalPricing?: boolean;
  }
): Promise<EnhancedQuote> => {
  try {
    const original = getBase64Data(originalImage);
    const generated = getBase64Data(generatedImage);

    // Get enhanced pricing context with seasonality
    const pricingContext = options?.applySeasonalPricing !== false
      ? getSeasonalPricingSummary()
      : getPricingSummary();

    // Get current seasonal marketing context
    const seasonalMarketingContext = getSeasonMarketingContext();

    const systemPrompt = `
      You are a professional lawncare estimator for Columbus, Ohio.
      Compare the 'Before' and 'After' images and the user's request ("${prompt}") to generate a realistic quote.

      Use ONLY the following pricing registry for costs:
      ${pricingContext}

      Rules:
      1. Estimate quantities visually (e.g., estimate sq ft of pavers, number of plants).
      2. Be generous with labor estimates.
      3. Return a JSON object with items, subtotal, tax (8%), total, and estimatedDuration.
      4. For each item, include a serviceId that matches our pricing registry.
      5. Consider current season (${seasonalMarketingContext.season}) for appropriate service suggestions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Before Image:" },
          { inlineData: { mimeType: original.mimeType, data: original.base64Data } },
          { text: "After Image:" },
          { inlineData: { mimeType: generated.mimeType, data: generated.base64Data } },
          { text: systemPrompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  serviceId: { type: Type.STRING },
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  total: { type: Type.NUMBER }
                }
              }
            },
            subtotal: { type: Type.NUMBER },
            tax: { type: Type.NUMBER },
            total: { type: Type.NUMBER },
            estimatedDuration: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate quote JSON");

    const baseQuote = safeJsonParse(text) as Quote;

    // Apply seasonal pricing if enabled (default: true)
    if (options?.applySeasonalPricing !== false && baseQuote.items) {
      const seasonalItems = applySeasonalPricing(baseQuote.items);
      const seasonalTotals = calculateSeasonalQuoteTotals(seasonalItems);

      // Find applicable promotions
      const serviceIds = baseQuote.items.map(item => item.serviceId);
      const promotionContext: PromotionContext = {
        serviceIds,
        locationSlug: options?.locationSlug || 'columbus',
        customerType: options?.customerType || 'new',
        orderValue: seasonalTotals.subtotal
      };

      const applicablePromotions = findApplicablePromotions(promotionContext);

      // Get social proof
      const socialProof = getSocialProofPackage(options?.locationSlug, serviceIds);

      // Build enhanced quote
      const enhancedQuote: EnhancedQuote = {
        ...baseQuote,
        // Override with seasonal totals
        subtotal: seasonalTotals.subtotal,
        tax: seasonalTotals.tax,
        total: seasonalTotals.total,
        // Add seasonal context
        seasonalContext: {
          season: seasonalMarketingContext.season,
          demandLevel: seasonalItems[0]?.seasonalNote ? 'adjusted' : 'standard',
          adjustedItems: seasonalItems,
          seasonalSavings: seasonalTotals.totalSavings,
          seasonalPremium: seasonalTotals.totalPremium
        },
        // Add promotions
        promotions: applicablePromotions.map(p => {
          const display = formatPromotionDisplay(p.promotion);
          return {
            name: p.promotion.name,
            discount: p.discountAmount,
            code: p.promotion.code,
            badge: display.badge
          };
        }),
        // Add social proof
        socialProof: {
          rating: socialProof.overallRating,
          reviewCount: socialProof.totalReviews
        },
        // Track original vs adjusted
        originalSubtotal: baseQuote.subtotal,
        adjustedSubtotal: seasonalTotals.subtotal
      };

      return enhancedQuote;
    }

    return baseQuote;
  } catch (error) {
    console.error("Quote Generation Error:", error);
    throw new Error("Could not calculate estimate.");
  }
};

/**
 * Generates a Property Optimization Report (Audit).
 */
export const generatePropertyReport = async (imageBase64: string): Promise<PropertyReport> => {
  try {
    const { base64Data, mimeType } = getBase64Data(imageBase64);

    const prompt = `
      Perform a professional lawncare audit on this image.

      1. Analyze condition: Grass health, weed density, edging, debris.
      2. Recommend 3 improvements ranked by ROI (Return on Investment).
      3. Predict curb appeal boost.

      Return JSON matching this structure exactly:
      {
        "overallScore": number (0-100),
        "summary": "2 sentence executive summary",
        "metrics": [
          { "name": "Grass Health", "score": number, "status": "Excellent"|"Good"|"Needs Attention"|"Critical", "details": "explanation" },
          { "name": "Weed Density", "score": number, "status": "...", "details": "explanation" },
          { "name": "Edging & Lines", "score": number, "status": "...", "details": "explanation" },
          { "name": "Debris & Cleanliness", "score": number, "status": "...", "details": "explanation" }
        ],
        "recommendations": [
          { "title": "Improvement Name", "description": "What to do", "roi": "High"|"Medium"|"Low", "estimatedCost": "$$", "impact": "description of result" }
        ],
        "curbAppealPrediction": "Predictive statement about value increase"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  details: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  roi: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  impact: { type: Type.STRING }
                }
              }
            },
            curbAppealPrediction: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate report");

    return safeJsonParse(text) as PropertyReport;

  } catch (error) {
    console.error("Audit Error:", error);
    throw new Error("Could not generate property report.");
  }
};
