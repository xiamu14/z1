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
      { hostname: 'pica.zhimg.com' },
      { hostname: 'pub-f588820721c2423d8874ab668e6f5a74.r2.dev' },
      { hostname: 'liblibai-online.liblib.cloud' },
    ],
    disableStaticImages: false,
  },
};

export default nextConfig;
