'use client';
import { useParams } from 'next/navigation';
import { allPosts } from '@/.content';
import { Box, Center, VStack } from '@/components/ui/layouts';
import Image from 'next/image';

export default function Post() {
  const { slug } = useParams();
  const currentPost = allPosts.find((p) => p.id === slug);
  if (!currentPost) return null;
  return (
    <Center className='w-full'>
      <VStack className='top-[-140px] relative items-center w-[680px]'>
        <Box className='rounded-[15px] overflow-hidden'>
          {currentPost?.frontMatter.cover && (
            <Image
              src={currentPost.frontMatter.cover}
              width={660}
              height={280}
              alt='post cover'
              className='w-[680px] h-[320px] object-cover'
            />
          )}
        </Box>
        <VStack className='mt-[10px] px-[12px] py-[20px]'>
          <h1 className='font-bold text-[#333] text-[1.5rem]'>
            {currentPost?.frontMatter.title}
          </h1>
        </VStack>
        <div
          className='px-[10px] w-full text-paragraph-sm text-text-sub-600 post-content'
          dangerouslySetInnerHTML={{
            __html: currentPost?.content ?? '',
          }}
          onClick={(event) => {
            let node = event.target as HTMLElement | null;
            while (node && node !== event.currentTarget) {
              if (
                node.tagName &&
                ['code', 'pre'].indexOf(node.tagName.toLowerCase()) !== -1
              ) {
                // 获取 node 里的文本
                const text = node.innerText;
                if (text) {
                  navigator.clipboard.writeText(text);
                }
                // TODO: toast 提示
                console.log('已复制');
                break;
              }
              node = node.parentElement;
            }
          }}
        ></div>
      </VStack>
    </Center>
  );
}
