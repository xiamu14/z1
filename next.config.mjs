/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    disableStaticImages: false,
    domains: ['images.ctfassets.net', 'images.unsplash.com'],
  },
};

export default nextConfig;
