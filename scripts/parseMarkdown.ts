import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function parseMarkdown(markdown: string) {
  const parsed = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .use(remarkRehype)
    .use(rehypeShiki, {
      // or `theme` for a single theme
      themes: {
        light: 'min-light',
        dark: 'min-dark',
      },
    })
    .use(rehypeStringify)
    .process(markdown);
  return String(parsed);
}
