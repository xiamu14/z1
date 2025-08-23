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
