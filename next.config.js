/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['logo.clearbit.com', 'img.logo.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 