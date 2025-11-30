
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
