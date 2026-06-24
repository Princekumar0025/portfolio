import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/orders/:path*',
        destination: 'http://localhost:3001/api/v1/orders/:path*' // Proxy to Order Service
      },
      {
        source: '/api/v1/ai/:path*',
        destination: 'http://localhost:3002/api/v1/ai/:path*' // Proxy to AI Service
      }
    ];
  }
};

export default nextConfig;
