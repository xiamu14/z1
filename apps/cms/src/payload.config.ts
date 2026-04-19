import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { r2Storage } from '@payloadcms/storage-r2';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const runtimeCloudflare = globalThis as typeof globalThis & {
  cloudflare?: {
    env?: {
      D1?: unknown;
      R2?: unknown;
    };
  };
};
const cloudflareEnv = runtimeCloudflare.cloudflare?.env;
const hasCloudflareBindings = Boolean(cloudflareEnv?.D1 && cloudflareEnv?.R2);
const localDatabasePath = path.resolve(dirname, '../.data/payload.db');

if (!hasCloudflareBindings) {
  fs.mkdirSync(path.dirname(localDatabasePath), { recursive: true });
}

const db = hasCloudflareBindings && cloudflareEnv
  ? sqliteD1Adapter({
      binding: cloudflareEnv.D1 as never,
      readReplicas: 'first-primary',
    })
  : sqliteAdapter({
      client: {
        url: process.env.DATABASE_URL || `file:${localDatabasePath}`,
      },
    });

const plugins =
  hasCloudflareBindings && cloudflareEnv
    ? [
        r2Storage({
          bucket: cloudflareEnv.R2 as never,
          collections: {
            media: process.env.R2_PUBLIC_URL
              ? {
                  disablePayloadAccessControl: true,
                  generateFileURL: ({ filename, prefix }) => {
                    const key = prefix ? `${prefix}/${filename}` : filename;
                    return `${process.env.R2_PUBLIC_URL}/${key}`;
                  },
                }
              : true,
          },
        }),
      ]
    : [];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, './app/(payload)'),
      importMapFile: path.resolve(
        dirname,
        './app/(payload)/admin/importMap.js',
      ),
    },
  },
  collections: [Users, Media, Posts],
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3102',
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3102',
    'http://localhost:3100',
    'http://127.0.0.1:3100',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3102',
    'http://localhost:3100',
    'http://127.0.0.1:3100',
  ],
  editor: lexicalEditor(),
  routes: {
    admin: '/admin',
    api: '/api',
  },
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },
  db,
  plugins,
});
