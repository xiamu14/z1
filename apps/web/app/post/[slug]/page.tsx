import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Box, Center, VStack } from '@/components/ui/layouts';
import { getContentPostBySlug } from '@/libs/content/repository';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const currentPost = await getContentPostBySlug(slug);

  if (!currentPost) {
    notFound();
  }

  return (
    <Center className='w-full'>
      <VStack className='relative top-[-140px] w-[680px] items-center'>
        <Box className='overflow-hidden rounded-[15px]'>
          {currentPost.cover && (
            <Image
              src={currentPost.cover}
              width={660}
              height={280}
              alt='post cover'
              className='h-[320px] w-[680px] object-cover'
            />
          )}
        </Box>
        <VStack className='mt-[10px] px-[12px] py-[20px]'>
          <h1 className='text-[1.5rem] font-bold text-[#333]'>
            {currentPost.title}
          </h1>
        </VStack>
        <div
          className='post-content w-full px-[10px] text-paragraph-sm text-text-sub-600'
          dangerouslySetInnerHTML={{
            __html: currentPost.content,
          }}
        />
      </VStack>
    </Center>
  );
}
