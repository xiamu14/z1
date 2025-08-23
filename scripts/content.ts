import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import { parseMarkdown } from './parseMarkdown';
import yaml from 'js-yaml';
import { md5Nanoid } from './utils';

type FrontMatter = {
  title: string;
  description?: string;
};

type FileMeta = {
  filePath: string;
  content: string;
  fileName: string;
  subject: string[];
  md5: string;
  frontMatter: FrontMatter;
};

export async function getFile() {
  const files = await glob('posts/**/*.md');
  console.log('files', files);
  const fileMetaList = [];
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const fileState = fs.statSync(filePath);
    const updateAt = fileState.mtimeMs;

    const frontMeta = /---(.*?)---/gs.exec(content);
    let frontMatter: FrontMatter | undefined = undefined;
    if (frontMeta) {
      frontMatter = yaml.load(frontMeta[1]) as FrontMatter;
      console.log('[matter]', frontMatter);
    }

    if (!frontMatter || !frontMatter?.title) {
      console.error(
        `Error: Missing title in front matter for file: ${filePath}`,
      );
      continue;
    }

    const parsedContent = await parseMarkdown(content);
    const fileName = path.basename(filePath, path.extname(filePath));
    const subject = file
      .split('/')
      .slice(0, -1)
      .filter((item) => item !== 'posts');

    fileMetaList.push({
      filePath,
      content: parsedContent,
      fileName,
      subject,
      md5: md5Nanoid(frontMatter.title, 6),
      frontMatter,
      updateAt,
    });
  }
  return fileMetaList;
}

async function main() {
  const contentDir = path.join(process.cwd(), '.content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  const fileMetaList = await getFile();
  const indexFilePath = path.join(process.cwd(), '.content', 'index.ts');
  if (!fs.existsSync(indexFilePath)) {
    fs.writeFileSync(
      indexFilePath,
      `export { allPosts, type PostType } from './meta';\n`,
      {
        encoding: 'utf-8',
      },
    );
  }

  const metaFilePath = path.join(process.cwd(), '.content', 'meta.ts');

  const postsPath = path.join(process.cwd(), '.content/posts');

  fs.rmSync(postsPath, { recursive: true, force: true });
  fs.mkdirSync(postsPath);

  fileMetaList.forEach((file) => {
    const filePath = path.join(
      process.cwd(),
      '.content',
      'posts',
      `${file.fileName}.ts`,
    );
    fs.writeFileSync(
      filePath,
      `export default ${JSON.stringify(file, null, 2)}`,
    );
  });

  const metaDir = path.dirname(metaFilePath);
  if (!fs.existsSync(metaDir)) {
    fs.mkdirSync(metaDir, { recursive: true });
  }
  const metaContent = `
// @ts-nocheck
type FrontMatter = {
  title: string;
  description?: string;
  cover?: string;
};

export type PostType = {
  filePath: string;
  content: string;
  fileName: string;
  subject: string[];
  md5: string;
  frontMatter: FrontMatter;
  updateAt: number;
};

function importAll(r: __WebpackModuleApi.RequireContext) {
  return r
    .keys()
    .filter((key) => !key.includes('.content/posts')) // 过滤掉重复
    .map((key) => r(key).default || r(key));
}

export const allPosts = importAll(
  require.context('./posts/', false, /.ts$/),
) as PostType[];
\n`;
  fs.writeFileSync(metaFilePath, metaContent, { encoding: 'utf-8' });
  // console.log(fileMetaList);
}

main();
