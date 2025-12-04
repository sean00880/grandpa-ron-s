'use client';


import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, Loader2 } from 'lucide-react';
import { getCachedReviews } from '../services/googleReviewsService';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

interface GoogleReviewsWidgetProps {
  maxReviews?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export const GoogleReviewsWidget: React.FC<GoogleReviewsWidgetProps> = ({
  maxReviews = 5,
  showHeader = true,
  compact = false
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCachedReviews();
      setReviews(data?.reviews?.slice(0, maxReviews) ?? []);
      setOverallRating(data?.rating ?? 0);
      // Support both API response formats (user_ratings_total from service, totalReviews from API)
      setTotalReviews(data?.user_ratings_total ?? data?.totalReviews ?? 0);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={compact ? 16 : 20}
        fill={i < rating ? '#fbbf24' : 'none'}
        stroke={i < rating ? '#fbbf24' : '#d1d5db'}
        className="transition-all"
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        <p>Unable to load reviews at this time.</p>
        <p className="text-sm mt-2">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-8'}`}>
      {showHeader && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {renderStars(Math.round(overallRating ?? 0))}
            </div>
            <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {overallRating?.toFixed(1)} out of 5
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {reviews?.map((review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700"
          >
            {/* Reviewer Header */}
            <div className="flex items-start gap-4 mb-4">
              {review?.profile_photo_url ? (
                <img
                  src={review.profile_photo_url}
                  alt={review?.author_name ?? 'Reviewer'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/previews/058/338/462/non_2x/generic-profile-picture-placeholder-default-user-profile-image-vector.jpg';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg">
                  {review?.author_name?.charAt(0)?.toUpperCase() ?? 'A'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                  {review?.author_name ?? 'Anonymous'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {renderStars(review?.rating ?? 0)}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {review?.relative_time_description ?? ''}
                </p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              "{review?.text ?? ''}"
            </p>
          </div>
        ))}
      </div>

      {/* View All Reviews Link */}
      <div className="text-center pt-4">
        <a
          href="https://www.google.com/maps/place/Grandpa+Ron's+Lawns+and+Landscape"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 font-semibold text-lg transition-colors"
        >
          View All {totalReviews} Reviews on Google
          <ExternalLink size={18} />
        </a>
      </div>

      {/* Google Attribution */}
      <div className="flex items-center justify-center gap-2 pt-4 opacity-60">
        <svg className="w-16 h-auto" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
          <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
          <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
        </svg>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Powered by Google</span>
      </div>
    </div>
  );
};
