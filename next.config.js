/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: [
      'api.growthlab.sg',
      'growthlab.sg',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.growthlab.sg',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Environment variables
  env: {
    GROWTHLAB_API_URL: process.env.NEXT_PUBLIC_GROWTHLAB_API_URL,
    GROWTHLAB_AUTH_URL: process.env.NEXT_PUBLIC_GROWTHLAB_AUTH_URL,
  },

  // Headers for API integration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Platform' },
        ],
      },
    ];
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;

