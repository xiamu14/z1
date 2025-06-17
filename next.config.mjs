/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'picx.zhimg.com' },
      { hostname: 'pic.dmjnb.com' },
    ],
    disableStaticImages: false,
  },
};

export default nextConfig;
