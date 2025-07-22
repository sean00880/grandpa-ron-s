/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "images.pexels.com", "dropbox.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'dropbox.com',
      },
        {
        protocol: 'https',
        hostname: 'granpdarons.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
  // App Router is enabled by default in Next.js 13+
}

module.exports = nextConfig
