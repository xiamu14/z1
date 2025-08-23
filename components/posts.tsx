'use client';
import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import { useMemo } from 'react';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';
import Image from 'next/image';
import { allPosts, PostType } from '@/.content';
import Link from 'next/link';
type CardType = PostType & { type?: 'music' | 'post' | 'video' };

console.log('[allPosts]', allPosts.length);

const ItemContent: React.FC<{ data: PostType; onClick?: () => void }> = ({
  data,
  onClick,
}) => {
  return (
    <div className='p-[6px]'>
      <VStack className='cursor-pointer rounded-[10px] border bg-white p-[16px] hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px]'>
        <HStack className='h-[18px] items-center gap-[10px]'>
          <div className='h-full w-[4px] rounded-xl bg-primary-base'></div>
          <h3 className='truncate font-bold text-static-black'>
            {data.frontMatter.title}
          </h3>
        </HStack>
        <Divider className='mb-[10px] mt-[12px]' />
        <Box>{data.frontMatter.description ?? ''}</Box>

        {data.frontMatter.cover && (
          <Box className='mt-[10px] overflow-hidden rounded-[4px]'>
            <Image
              src={data.frontMatter.cover}
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

export function Posts() {
  const allCards = useMemo(() => {
    const posts: CardType[] = [...allPosts].sort(
      (a, b) => b.updateAt - a.updateAt,
    );
    return posts;
  }, []);

  return (
    <div className='scroll-smooth'>
      <VirtuosoMasonry
        columnCount={3}
        data={allCards}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflow: 'visible',
        }}
        initialItemCount={allCards.length}
        ItemContent={({
          data: card,
          index,
        }: {
          data: CardType;
          index: number;
        }) => {
          return (
            card && (
              <Link key={card.id} href={`/post/${card.id}`}>
                <ItemContent data={card} />
              </Link>
            )
          );
        }}
      />
    </div>
  );
}
