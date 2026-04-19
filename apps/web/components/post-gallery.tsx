import Link from 'next/link';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';
import Image from 'next/image';
import type { ContentPost } from '@/libs/content/types';

const ItemContent: React.FC<{ data: ContentPost }> = ({ data }) => {
  return (
    <div className='p-[6px]'>
      <VStack className='bg-white hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] p-[16px] border rounded-[10px] cursor-pointer'>
        <HStack className='items-center gap-[10px] h-[18px]'>
          <div className='bg-primary-base rounded-xl w-[4px] h-full'></div>
          <h3 className='text-static-black font-bold truncate'>{data.title}</h3>
        </HStack>
        <Divider className='mt-[12px] mb-[10px]' />
        <Box>{data.excerpt}</Box>

        {data.cover && (
          <Box className='mt-[10px] rounded-[4px] overflow-hidden'>
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

export default function PostGallery({ posts }: { posts: ContentPost[] }) {
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
