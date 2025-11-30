'use client';


import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
  variant = 'default'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-green-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  const getVariantByValue = (val: number): string => {
    if (variant !== 'default') return variantClasses[variant];
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-yellow-500';
    if (val >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn('rounded-full', getVariantByValue(percentage))}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: '100%' }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 text-right">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

// Circular progress bar
export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (val: number): string => {
    if (val >= 80) return '#10b981'; // green-500
    if (val >= 60) return '#eab308'; // yellow-500
    if (val >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-zinc-200 dark:text-zinc-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            strokeDasharray: circumference
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-zinc-900 dark:text-white">
            {percentage.toFixed(0)}
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            SCORE
          </span>
        </div>
      )}
    </div>
  );
};
