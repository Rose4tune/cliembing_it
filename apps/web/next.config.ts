import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // webpack 사용 (Turbopack 대신)
  webpack: (config) => {
    return config;
  },
  transpilePackages: [
    '@pkg/auth',
    '@pkg/config',
    '@pkg/domain',
    '@pkg/env',
    '@pkg/features',
    '@pkg/shared',
    '@pkg/style',
    '@pkg/supabase',
    '@pkg/ui',
    '@pkg/ui-web',
  ],
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
};

export default nextConfig;
