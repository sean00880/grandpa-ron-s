
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache Google Reviews for 24 hours
let cachedReviews: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Return cached reviews if still valid
    if (cachedReviews && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json(cachedReviews);
    }

    // Fetch from Google Places API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      // Return fallback reviews from database
      const dbReviews = await prisma.review.findMany({
        orderBy: { time: 'desc' },
        take: 6,
      });
      
      return NextResponse.json({
        success: true,
        reviews: dbReviews,
        rating: 4.9,
        totalReviews: dbReviews.length,
        source: 'database',
      });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();

    if (data.status === 'OK') {
      cachedReviews = {
        success: true,
        reviews: data.result?.reviews || [],
        rating: data.result?.rating || 4.9,
        totalReviews: data.result?.user_ratings_total || 0,
        source: 'google',
      };
      cacheTime = now;
      
      return NextResponse.json(cachedReviews);
    } else {
      throw new Error(data.error_message || 'Invalid response from Google');
    }
  } catch (error) {
    console.error('Reviews fetch error:', error);
    
    // Return fallback reviews from database
    try {
      const dbReviews = await prisma.review.findMany({
        orderBy: { time: 'desc' },
        take: 6,
      });
      
      return NextResponse.json({
        success: true,
        reviews: dbReviews,
        rating: 4.9,
        totalReviews: dbReviews.length,
        source: 'database',
      });
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }
  }
}
