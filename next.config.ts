/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/device-detector",
  trailingSlash: true,
};

module.exports = nextConfig;




