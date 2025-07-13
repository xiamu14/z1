'use client';
import { useParams } from 'next/navigation';
import { allPosts, PostType } from '@/.content';
import { Box, Center, VStack } from '@/components/ui/layouts';
import Image from 'next/image';

export default function Post() {
  const { slug } = useParams();
  const currentPost = allPosts.find((p) => p.md5 === slug);
  if (!currentPost) return null;
  return (
    <Center className='w-full'>
      <VStack className='relative top-[-110px] w-[640px] items-center'>
        <Box className='overflow-hidden rounded-[15px]'>
          {currentPost?.frontMatter.cover && (
            <Image
              src={currentPost.frontMatter.cover}
              width={660}
              height={280}
              alt='post cover'
              className='h-[280px] w-[640px] object-cover'
            />
          )}
        </Box>
        <VStack className='mt-[20px] px-[12px] py-[20px]'>
          <h3 className='text-title-h4'>{currentPost?.frontMatter.title}</h3>
        </VStack>
        <div
          className='post-content w-full px-[10px] text-paragraph-sm text-text-sub-600'
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
                // 这里处理 code 标签被点击的逻辑
                console.log('code 标签被点击');
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
