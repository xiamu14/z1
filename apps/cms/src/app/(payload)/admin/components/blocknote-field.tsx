'use client';

import dynamic from 'next/dynamic';

export const BlockNoteField = dynamic(
  () =>
    import('./blocknote-editor').then((module) => ({
      default: module.BlockNoteEditor,
    })),
  {
    ssr: false,
  },
);
