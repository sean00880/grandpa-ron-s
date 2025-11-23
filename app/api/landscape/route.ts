import { NextRequest, NextResponse } from 'next/server';
import { generateLandscapeRender, generateQuoteEstimation } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, imageBase64, instructions, region, originalImage, generatedImage, prompt } = body;

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

      const quote = await generateQuoteEstimation(originalImage, generatedImage, prompt);
      return NextResponse.json({ success: true, data: quote });
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
