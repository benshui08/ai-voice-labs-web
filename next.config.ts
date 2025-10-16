import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 修复 Firebase Auth 的 COOP 警告
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
