import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  "compilerOptions": {
    "types": [
      "jest",
      "@testing-library/jest-dom"
    ]
  },
  experimental: {
    clientInstrumentationHook: true,
  },
  images: {
    domains: [
      'downloader.disk.yandex.ru'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/login/_rsc',
        destination: '/login'
      },
      {
        source: '/api/geocode',
        destination: 'https://nominatim.openstreetmap.org/reverse',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/geocode',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/file',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      }
    ];
  }
};

export default nextConfig;
