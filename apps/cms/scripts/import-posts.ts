import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { BlockNoteEditor } from '@blocknote/core';
import { glob } from 'glob';
import yaml from 'js-yaml';
import { JSDOM } from 'jsdom';
import config from '../src/payload.config';
import { getPayload } from 'payload';

type FrontMatter = {
  title: string;
  description?: string;
  cover?: string;
};

const postsRoot = path.resolve(process.cwd(), '../web/posts');
const slugOverrides: Record<string, string> = {
  'post-1768707913558.md': 'beyond-vibe-coding-think',
};

type ImportStats = {
  created: number;
  failed: number;
  updated: number;
};

type ExistingPost = {
  id: number;
};

function setupDOM() {
  const { window } = new JSDOM('<!doctype html><html><body></body></html>');

  globalThis.window = window as unknown as typeof globalThis.window;
  globalThis.document = window.document;
  globalThis.DOMParser = window.DOMParser;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.HTMLDivElement = window.HTMLDivElement;
  globalThis.HTMLSpanElement = window.HTMLSpanElement;
  globalThis.Node = window.Node;

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: window.navigator,
  });
}

function extractFrontMatter(content: string): {
  frontMatter: FrontMatter;
  body: string;
} {
  const matched = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(content);

  if (!matched) {
    throw new Error('Missing front matter');
  }

  const frontMatter = yaml.load(matched[1]) as FrontMatter;
  const body = matched[2].trim();

  if (!frontMatter?.title) {
    throw new Error('Missing title in front matter');
  }

  return {
    frontMatter,
    body,
  };
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createSlug(file: string, title: string): string {
  if (slugOverrides[file]) {
    return slugOverrides[file];
  }

  const fileSlug = path.basename(file, path.extname(file));
  const titleSlug = slugify(title);
  const stableFileSlug = slugify(fileSlug.replace(/^post-\d+$/, fileSlug));

  if (fileSlug.startsWith('post-')) {
    return titleSlug || stableFileSlug;
  }

  return stableFileSlug || titleSlug;
}

function resolveLocalDatabasePath(): string {
  const databaseURL =
    process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), '.data/payload.db')}`;

  return databaseURL.startsWith('file:')
    ? databaseURL.slice('file:'.length)
    : databaseURL;
}

function findExistingPost(
  databasePath: string,
  column: 'slug' | 'title',
  value: string,
): ExistingPost | null {
  const escapedValue = value.replace(/'/g, "''");
  const sql = `select id from posts where ${column} = '${escapedValue}' limit 1;`;
  const output = execFileSync('sqlite3', [databasePath, sql], {
    encoding: 'utf-8',
  }).trim();

  if (!output) {
    return null;
  }

  return {
    id: Number(output),
  };
}

async function main() {
  setupDOM();

  const payload = await getPayload({ config });
  const databasePath = resolveLocalDatabasePath();
  const editor = BlockNoteEditor.create();
  const files = (await glob('**/*.md', {
    cwd: postsRoot,
    nodir: true,
  })).sort();
  const stats: ImportStats = {
    created: 0,
    failed: 0,
    updated: 0,
  };

  for (const file of files) {
    try {
      const filePath = path.join(postsRoot, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const stat = fs.statSync(filePath);
      const { frontMatter, body } = extractFrontMatter(raw);
      const slug = createSlug(file, frontMatter.title);

      if (!slug) {
        throw new Error('Unable to derive slug');
      }

      const tags = file
        .split('/')
        .slice(0, -1)
        .filter(Boolean)
        .map((value) => ({ value }));

      const existingBySlug = findExistingPost(databasePath, 'slug', slug);
      const existingByTitle =
        existingBySlug ||
        findExistingPost(databasePath, 'title', frontMatter.title.trim());

      const data = {
        title: frontMatter.title.trim(),
        slug,
        excerpt: frontMatter.description?.trim() ?? '',
        coverUrl: frontMatter.cover?.trim() || null,
        content: await editor.tryParseMarkdownToBlocks(body),
        status: 'published' as const,
        publishedAt: new Date(stat.mtimeMs).toISOString(),
        tags,
      };

      const existingDoc = existingByTitle;

      if (existingDoc) {
        await payload.update({
          collection: 'posts',
          id: existingDoc.id,
          data,
        });
        stats.updated += 1;
      } else {
        await payload.create({
          collection: 'posts',
          data,
        });
        stats.created += 1;
      }

      console.log(`Imported ${file} -> ${slug}`);
    } catch (error) {
      stats.failed += 1;
      console.error(`Failed to import ${file}:`, error);
    }
  }

  console.log(
    `Import finished. created=${stats.created} updated=${stats.updated} failed=${stats.failed}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
