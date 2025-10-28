import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@config', '@style'],
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
};

export default nextConfig;
