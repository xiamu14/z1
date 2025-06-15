import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import { parseMarkdown } from './parseMarkdown';
import yaml from 'js-yaml';

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
  const filesMeta = [];
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

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

    // 计算文件的 md5
    const crypto = await import('crypto');
    const md5 = crypto.createHash('md5').update(content).digest('hex');

    filesMeta.push({
      filePath,
      content: parsedContent,
      fileName,
      subject,
      md5,
      frontMatter,
    });
  }
  return filesMeta;
}

async function main() {
  const contentDir = path.join(process.cwd(), '.content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  const filesMeta = await getFile();
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
  const metaDir = path.dirname(metaFilePath);
  if (!fs.existsSync(metaDir)) {
    fs.mkdirSync(metaDir, { recursive: true });
  }
  const metaContent = `type FrontMatter = {
  title: string;
  description?: string;
  cover?:string;
};

export type PostType = {
  filePath: string;
  content: string;
  fileName: string;
  subject: string[];
  md5: string;
  frontMatter: FrontMatter;
};

 export const allPosts : PostType[] = ${JSON.stringify(filesMeta, null, 2)};\n`;
  fs.writeFileSync(metaFilePath, metaContent, { encoding: 'utf-8' });
  // console.log(filesMeta);
}

main();
