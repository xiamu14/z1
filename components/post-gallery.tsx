'use client';
import {
  ListBox,
  ListBoxItem,
  Size,
  Virtualizer,
  WaterfallLayout,
} from 'react-aria-components';
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

export default function PostGallery() {
  const allCards = useMemo(() => {
    const posts: CardType[] = [...allPosts].sort(
      (a, b) => b.updateAt - a.updateAt,
    );
    return posts;
  }, []);
  return (
    <div className='scroll-smooth'>
      <Virtualizer
        layout={WaterfallLayout}
        layoutOptions={{
          minItemSize: new Size(150, 500),
          minSpace: new Size(8, 8),
          maxColumns: 4,
        }}
      >
        <ListBox
          layout='grid'
          aria-label='Virtualized waterfall layout'
          selectionMode='multiple'
          items={allCards}
        >
          {(item) => {
            const card = item;
            return (
              <ListBoxItem>
                {card ? (
                  <Link key={card.id} href={`/post/${card.id}`}>
                    <ItemContent data={card} />
                  </Link>
                ) : null}
              </ListBoxItem>
            );
          }}
        </ListBox>
      </Virtualizer>
    </div>
  );
}
