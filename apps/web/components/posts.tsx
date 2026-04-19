import Link from 'next/link';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';
import Image from 'next/image';
import type { ContentPost } from '@/libs/content/types';

const ItemContent: React.FC<{ data: ContentPost }> = ({ data }) => {
  return (
    <div className='p-[6px]'>
      <VStack className='cursor-pointer rounded-[10px] border bg-white p-[16px] hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px]'>
        <HStack className='h-[18px] items-center gap-[10px]'>
          <div className='h-full w-[4px] rounded-xl bg-primary-base'></div>
          <h3 className='truncate font-bold text-static-black'>{data.title}</h3>
        </HStack>
        <Divider className='mb-[10px] mt-[12px]' />
        <Box>{data.excerpt}</Box>

        {data.cover && (
          <Box className='mt-[10px] overflow-hidden rounded-[4px]'>
            <Image
              src={data.cover}
              width={500}
              height={300}
              alt='picture'
            />
          </Box>
        )}
      </VStack>
    </div>
  );
};

export function Posts({ posts }: { posts: ContentPost[] }) {
  return (
    <div className='grid scroll-smooth grid-cols-1 gap-y-[4px] sm:grid-cols-2 xl:grid-cols-3'>
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.slug}`}>
          <ItemContent data={post} />
        </Link>
      ))}
    </div>
  );
}
