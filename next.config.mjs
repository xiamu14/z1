/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ hostname: 'images.unsplash.com' }],
    disableStaticImages: false,
  },
};

export default nextConfig;
