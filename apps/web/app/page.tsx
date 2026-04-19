import PostGallery from '@/components/post-gallery';
import { Center, VStack } from '@/components/ui/layouts';
import { listContentPosts } from '@/libs/content/repository';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await listContentPosts();

  return (
    <Center className='w-full'>
      <VStack className='my-[80px] w-[80%] min-w-[800px] max-w-[960px] flex-col items-center bg-white sm:my-[60px]'>
        <div className='w-full'>
          <h4 className='mb-[20px] text-title-h4'>All Articles</h4>
          <PostGallery posts={posts} />
        </div>
      </VStack>
    </Center>
  );
}
