import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import { parseMarkdown } from './parseMarkdown';
import yaml from 'js-yaml';
import crypto from 'crypto';
import { consola } from 'consola';
import { md5Nanoid } from './utils';

type FrontMatter = {
  title: string;
  description?: string;
};

async function getFile({ history }: { history: string[] }) {
  const files = await glob('posts/**/*.md');
  console.log('files', files);
  const fileMetaList = [];
  const newHistory = [];
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const fileState = fs.statSync(filePath);
    const updateAt = fileState.mtimeMs;

    const frontMeta = /---(.*?)---/gs.exec(content);
    let frontMatter: FrontMatter | undefined = undefined;
    if (frontMeta) {
      frontMatter = yaml.load(frontMeta[1]) as FrontMatter;
      // console.log('[matter]', frontMatter);
    }

    if (!frontMatter || !frontMatter?.title) {
      consola.error(
        `Error: Missing title in front matter for file: ${filePath}`,
      );
      continue;
    }

    const shortMd5 = md5Nanoid(frontMatter.title, 6);
    const md5 = crypto.createHash('md5').update(content).digest('hex');
    newHistory.push(md5);
    if (history.includes(md5)) {
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
      md5: md5,
      id: shortMd5,
      frontMatter,
      updateAt,
    });
  }
  return { fileMetaList, newHistory };
}

async function getHistory(): Promise<string[]> {
  const historyFile = path.join(process.cwd(), '.content/history.ts');
  if (!fs.existsSync(historyFile)) {
    return [];
  }
  const history = await import(historyFile);
  return history.default as string[];
}

async function main() {
  const contentDir = path.join(process.cwd(), '.content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  const history = await getHistory();
  const { fileMetaList, newHistory } = await getFile({ history });
  if (fileMetaList.length === 0) {
    consola.success('no post updates');
    return;
  } else {
    consola.info(`${fileMetaList.length} posts to be updated`);
    console.log(
      JSON.stringify(
        fileMetaList.map((item) => item.frontMatter),
        null,
        2,
      ),
    );
  }

  // const newHistory = fileMetaList.map((item) => item.md5);
  consola.info(newHistory);

  // dryRun
  // if (!0) return;

  const historyFile = path.join(process.cwd(), '.content/history.ts');
  fs.writeFileSync(
    historyFile,
    `export default ${JSON.stringify(newHistory)}`,
    { encoding: 'utf-8' },
  );

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

  // fs.rmSync(postsPath, { recursive: true, force: true });
  if (!fs.existsSync(postsPath)) {
    fs.mkdirSync(postsPath);
  }

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

  if (!fs.existsSync(metaFilePath)) {
    const metaContent = `
  // @ts-nocheck
  type FrontMatter = {
    title: string;
    description?: string;
    cover?: string;
  };
  
  export type PostType = {
    id:string,
    md5: string;
    filePath: string;
    content: string;
    fileName: string;
    subject: string[];
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
  }
}

main();
