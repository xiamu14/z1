import config from '@payload-config';
import '@payloadcms/next/css';
import type { ServerFunctionClient } from 'payload';
import {
  handleServerFunctions,
  RootLayout,
} from '@payloadcms/next/layouts';
import { importMap } from './admin/importMap.js';
import './custom.scss';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function PayloadLayout({ children }: Args) {
  return (
    <RootLayout
      config={Promise.resolve(config)}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{
        suppressHydrationWarning: true,
      }}
    >
      {children}
    </RootLayout>
  );
}
