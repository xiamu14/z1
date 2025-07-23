'use client';
import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import { useMemo } from 'react';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';

import Image from 'next/image';
import { allPosts, PostType } from '@/.content';
import MusicCard from './music-card';
import Link from 'next/link';
type CardType = PostType & { type?: 'music' | 'post' | 'video' };
const ItemContent: React.FC<{ data: PostType; onClick?: () => void }> = ({
  data,
  onClick,
}) => {
  return (
    <div className='p-[6px]'>
      <VStack className='cursor-pointer rounded-[10px] border bg-white p-[16px]'>
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
    const postsWithMusic: CardType[] = [...allPosts].map((item: CardType) => {
      item['type'] = 'post' as const;
      return item as CardType;
    });
    // postsWithMusic.splice(2, 0, { type: 'music' } as CardType);
    return postsWithMusic;
  }, []);

  return (
    <div className='scroll-smooth'>
      <VirtuosoMasonry
        columnCount={3}
        data={allCards}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        initialItemCount={allCards.length}
        ItemContent={({
          data: card,
          index,
        }: {
          data: CardType;
          index: number;
        }) => {
          if (card.type === 'music') {
            return <MusicCard />;
          }
          return (
            card && (
              <Link href={`/post/${card.md5}`}>
                <ItemContent data={card} />
              </Link>
            )
          );
        }}
      />
    </div>
  );
}
