import { renderBlockNote } from './render-blocknote';
import type { ContentPost, RemotePost } from './types';

const cmsBaseURL = process.env.CMS_URL?.replace(/\/$/, '');

async function normalizeRemotePost(post: RemotePost): Promise<ContentPost> {
  const renderedContent = await renderBlockNote(post.content);

  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    cover: post.cover?.url ?? post.coverUrl ?? undefined,
    content: renderedContent,
    updatedAt: post.updatedAt ? new Date(post.updatedAt).getTime() : Date.now(),
    publishedAt: post.publishedAt ?? undefined,
    source: 'cms',
  };
}

async function fetchRemotePosts(): Promise<ContentPost[]> {
  if (!cmsBaseURL) {
    throw new Error('CMS_URL is not configured');
  }

  const query = encodeURIComponent(
    JSON.stringify({
      status: {
        equals: 'published',
      },
    }),
  );
  const response = await fetch(
    `${cmsBaseURL}/api/posts?limit=100&depth=1&sort=-publishedAt&where=${query}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const data = (await response.json()) as { docs?: RemotePost[] };
  const posts = await Promise.all((data.docs ?? []).map(normalizeRemotePost));

  return posts;
}

async function fetchRemotePostBySlug(slug: string): Promise<ContentPost | null> {
  if (!cmsBaseURL) {
    throw new Error('CMS_URL is not configured');
  }

  const query = encodeURIComponent(
    JSON.stringify({
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    }),
  );
  const response = await fetch(
    `${cmsBaseURL}/api/posts?limit=1&depth=1&where=${query}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.status}`);
  }

  const data = (await response.json()) as { docs?: RemotePost[] };
  const post = data.docs?.[0];

  return post ? normalizeRemotePost(post) : null;
}

export async function listContentPosts(): Promise<ContentPost[]> {
  return fetchRemotePosts();
}

export async function getContentPostBySlug(
  slug: string,
): Promise<ContentPost | null> {
  return fetchRemotePostBySlug(slug);
}
