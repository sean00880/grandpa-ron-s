
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pnpm workspace packages — resolved via workspace:* + transpilePackages
  transpilePackages: ['@growsz/wcg-core', '@growsz/core', '@growsz/dbity-runtime', '@growsz/orcbase-core', '@growsz/dbity-core', '@growsz/arcorc-layout'],
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Ignore TypeScript errors during build (React 19 + lucide-react type compatibility)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Mark Prisma as an external package for proper monorepo resolution
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
};

export default nextConfig;
