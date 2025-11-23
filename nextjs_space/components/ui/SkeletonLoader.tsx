'use client';


import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangular'
}) => {
  const baseClasses = 'bg-zinc-200 dark:bg-zinc-800 animate-pulse';
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

// Card skeleton for loading cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 ${className}`}>
      <SkeletonLoader width="48px" height="48px" variant="circular" className="mb-4" />
      <SkeletonLoader width="70%" height="24px" className="mb-3" />
      <SkeletonLoader width="100%" height="16px" className="mb-2" />
      <SkeletonLoader width="90%" height="16px" />
    </div>
  );
};

// List skeleton for loading lists
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <SkeletonLoader width="48px" height="48px" variant="circular" />
          <div className="flex-1">
            <SkeletonLoader width="40%" height="20px" className="mb-2" />
            <SkeletonLoader width="60%" height="16px" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Image skeleton with shimmer effect
export const ImageSkeleton: React.FC<{ 
  aspectRatio?: string;
  className?: string;
}> = ({ aspectRatio = '16/9', className = '' }) => {
  return (
    <div 
      className={`relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className}`}
      style={{ aspectRatio }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
        {Array.from({ length: columns }).map((_, idx) => (
          <SkeletonLoader key={idx} width="100%" height="16px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonLoader key={colIdx} width="100%" height="20px" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Dashboard skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <SkeletonLoader width="200px" height="32px" />
        <SkeletonLoader width="150px" height="20px" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <SkeletonLoader width="100%" height="200px" />
    </div>
  );
};
