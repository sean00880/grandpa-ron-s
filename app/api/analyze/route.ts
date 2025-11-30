import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageForSuggestions } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing required field: imageBase64' },
        { status: 400 }
      );
    }

    const suggestions = await analyzeImageForSuggestions(imageBase64);
    return NextResponse.json({ success: true, data: suggestions });
  } catch (error: any) {
    console.error('Analyze API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
