/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "img.garagepotti.xyz" },
      { protocol: "https", hostname: "img.garagepotti.xyz" },
    ],
  },
};

export default nextConfig;
