import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

export const postContentEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
  ],
});
