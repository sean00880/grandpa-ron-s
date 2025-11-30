/**
 * STACK_REGISTRY - Grandpa Ron Technology Stack
 *
 * Defines the technology stack for the lawncare services platform
 */

import type { TierId, EnvId } from '../core/dev-pipelines/types';

// ============================================================================
// Stack Profile Interface
// ============================================================================

export interface StackProfile {
  id: string;
  displayName: string;
  description: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'ai' | 'data' | 'infra';
  minTier: TierId;
  envCompatibility: EnvId[];
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    ai?: string[];
    infra?: string[];
    other?: string[];
  };
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun';
  typescript: boolean;
  monorepo?: boolean;
  configFiles: string[];
  deploymentTargets: string[];
  examples?: string[];
}

// ============================================================================
// Grandpa Ron Stack Registry
// ============================================================================

export const STACK_REGISTRY: Record<string, StackProfile> = {
  'grandpa-ron-fullstack': {
    id: 'grandpa-ron-fullstack',
    displayName: 'Grandpa Ron Full Stack',
    description: 'Complete stack for lawncare services marketplace platform',
    category: 'fullstack',
    minTier: 'free',
    envCompatibility: ['local', 'dev', 'staging', 'production', 'preview'],
    technologies: {
      frontend: [
        'Next.js 16',
        'React 19',
        'TypeScript 5',
        'Tailwind CSS 4',
        'Framer Motion',
        'Lucide Icons',
        'Recharts',
        'class-variance-authority',
      ],
      backend: [
        'Next.js API Routes',
        'Prisma ORM 6.7',
        'EmailJS',
      ],
      database: [
        'PostgreSQL (Supabase)',
        'Prisma Client',
      ],
      ai: [
        'Google Generative AI (Gemini)',
        'Property Analysis AI',
        'Quote Generation AI',
        'Scheduling Optimization',
      ],
      infra: [
        'Vercel (hosting)',
        'Supabase (backend)',
        'Vercel Analytics',
        'Google reCAPTCHA',
      ],
      other: [
        'React Hot Toast',
        'React Google reCAPTCHA',
        'Mammoth (document parsing)',
      ],
    },
    packageManager: 'npm',
    typescript: true,
    monorepo: false,
    configFiles: [
      'next.config.ts',
      'tsconfig.json',
      'tailwind.config.js',
      'postcss.config.mjs',
      'prisma/schema.prisma',
      '.env.local',
    ],
    deploymentTargets: [
      'Vercel Production',
      'Vercel Preview',
      'Self-hosted (Docker)',
    ],
    examples: [
      'ecosystems/grandpa-ron-nextjs',
    ],
  },

  'grandpa-ron-ai': {
    id: 'grandpa-ron-ai',
    displayName: 'Grandpa Ron AI Stack',
    description: 'AI/ML infrastructure for intelligent service matching and pricing',
    category: 'ai',
    minTier: 'provider',
    envCompatibility: ['dev', 'staging', 'production'],
    technologies: {
      ai: [
        'Google Generative AI',
        'Gemini Pro',
        'Gemini Pro Vision',
        'Property Image Analysis',
        'Natural Language Processing',
      ],
      backend: [
        'Next.js API Routes',
        'TypeScript',
        'Zod (validation)',
      ],
      database: [
        'Vector embeddings (planned)',
        'Training data storage',
      ],
      other: [
        'Rate limiting',
        'Caching layer',
        'Response streaming',
      ],
    },
    packageManager: 'npm',
    typescript: true,
    configFiles: [
      '.env.local (AI API keys)',
      'lib/ai/config.ts',
    ],
    deploymentTargets: [
      'Vercel Edge Functions',
      'Serverless Functions',
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get stack profile by ID
 */
export function getStack(stackId: string): StackProfile | undefined {
  return STACK_REGISTRY[stackId];
}

/**
 * Get all stacks compatible with a tier
 */
export function getStacksForTier(tierId: TierId): StackProfile[] {
  return Object.values(STACK_REGISTRY).filter(
    (stack) => stack.minTier === tierId || tierId === 'enterprise'
  );
}

/**
 * Get all stacks by category
 */
export function getStacksByCategory(category: StackProfile['category']): StackProfile[] {
  return Object.values(STACK_REGISTRY).filter(
    (stack) => stack.category === category
  );
}

/**
 * Check if stack is compatible with environment
 */
export function isStackCompatibleWithEnv(stackId: string, envId: EnvId): boolean {
  const stack = STACK_REGISTRY[stackId];
  return stack ? stack.envCompatibility.includes(envId) : false;
}
