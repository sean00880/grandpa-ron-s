'use client';


import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { fadeInUp } from '../../utils/animations';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';

  const variantClasses = {
    default: 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800',
    elevated: 'bg-white dark:bg-zinc-900 shadow-lg',
    bordered: 'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800',
    glass: 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-white/20 dark:border-zinc-800/50'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:shadow-green-900/5 hover:border-green-500/30 dark:hover:border-green-500/30 cursor-pointer' 
    : '';

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hover ? { y: -5 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
};

// Card Title component
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={cn('text-xl font-bold text-zinc-900 dark:text-white', className)}>
      {children}
    </h3>
  );
};

// Card Description component
export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-zinc-600 dark:text-zinc-400 mt-2', className)}>
      {children}
    </p>
  );
};

// Card Footer component
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800', className)}>
      {children}
    </div>
  );
};
