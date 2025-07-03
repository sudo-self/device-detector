import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export", 
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/device-detector" : "",
  assetPrefix: isGithubPages ? "/device-detector/" : "",
};

export default nextConfig;

