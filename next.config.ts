import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/sse",
        destination: "http://localhost:8000/api/sse", // your backend SSE endpoint
      },
    ];
  },
};

export default nextConfig;
