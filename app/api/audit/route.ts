import { NextRequest, NextResponse } from 'next/server';
import { generatePropertyReport } from '@/services/geminiService';

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

    const report = await generatePropertyReport(imageBase64);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error('Audit API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate property report' },
      { status: 500 }
    );
  }
}
