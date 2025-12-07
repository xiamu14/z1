'use client';
import {
  ListBox,
  ListBoxItem,
  Size,
  Virtualizer,
  WaterfallLayout,
} from 'react-aria-components';
import { useEffect, useMemo, useState } from 'react';
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
      <VStack className='bg-white hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] p-[16px] border rounded-[10px] cursor-pointer'>
        <HStack className='items-center gap-[10px] h-[18px]'>
          <div className='bg-primary-base rounded-xl w-[4px] h-full'></div>
          <h3 className='text-static-black font-bold truncate'>
            {data.frontMatter.title}
          </h3>
        </HStack>
        <Divider className='mt-[12px] mb-[10px]' />
        <Box>{data.frontMatter.description ?? ''}</Box>

        {data.frontMatter.cover && (
          <Box className='mt-[10px] rounded-[4px] overflow-hidden'>
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
  const [size, setSize] = useState<Size | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      setSize(new Size(220, 300));
    }, 100);
  }, []);

  return (
    <div className='scroll-smooth'>
      <Virtualizer
        layout={WaterfallLayout}
        layoutOptions={{
          minItemSize: size,
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
