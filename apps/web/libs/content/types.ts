export type LocalPost = {
  id: string;
  content: string;
  fileName: string;
  frontMatter: {
    title: string;
    description?: string;
    cover?: string;
  };
  updateAt: number;
};

export type RemoteMedia = {
  alt?: string | null;
  url?: string | null;
};

export type RemotePost = {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  cover?: RemoteMedia | null;
  audio?: RemoteMedia | null;
  tags?: Array<{ value?: string | null }> | null;
};

export type ContentPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  content: string;
  updatedAt: number;
  publishedAt?: string;
  source: 'cms' | 'local';
};
