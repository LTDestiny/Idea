/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.save.moe",
      },
      {
        protocol: "https",
        hostname: "anh.moe",
      },
    ],
  },
};

export default nextConfig;
