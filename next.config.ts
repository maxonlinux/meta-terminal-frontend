import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.amberdata.io",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: false,
};

export default nextConfig;
