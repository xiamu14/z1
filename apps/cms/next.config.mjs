import path from 'node:path';
import { createRequire } from 'node:module';
import { withPayload } from '@payloadcms/next/withPayload';

const require = createRequire(import.meta.url);
const payloadMain = require.resolve('payload');
const payloadRequire = createRequire(payloadMain);
const payloadUIPath = payloadRequire.resolve('@payloadcms/ui');
const payloadUISharedPath = payloadRequire.resolve('@payloadcms/ui/shared');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  transpilePackages: [
    '@blocknote/core',
    '@blocknote/react',
    '@blocknote/mantine',
    'yjs',
    'y-prosemirror',
    'y-protocols',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(process.cwd(), 'src/payload.config.ts'),
      '@payloadcms/ui$': payloadUIPath,
      '@payloadcms/ui/shared$': payloadUISharedPath,
    };

    return config;
  },
};

export default withPayload(nextConfig);
