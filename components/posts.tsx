'use client';
import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import { useMemo, useState } from 'react';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';
import * as Modal from './ui/modal';
import * as Button from './ui/button';

import Image from 'next/image';
import { allPosts, PostType } from '@/.content';
import MusicCard from './music-card';
type CardType = PostType & { type?: 'music' | 'post' | 'video' };
const ItemContent: React.FC<{ data: PostType; onClick: () => void }> = ({
  data,
  onClick,
}) => {
  return (
    <div className='p-[8px]' onClick={onClick}>
      <VStack className='cursor-pointer rounded-[10px] border bg-white p-[24px]'>
        <HStack className='h-[18px] items-center gap-[10px]'>
          <div className='h-full w-[4px] rounded-xl bg-primary-base'></div>
          <h3 className='font-bold text-static-black'>
            {data.frontMatter.title}
          </h3>
        </HStack>
        <Divider className='my-[20px]' />
        <Box>{data.frontMatter.description ?? ''}</Box>

        {data.frontMatter.cover && (
          <Box className='mt-[20px] overflow-hidden rounded-[12px]'>
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
  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType>();
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
        style={{ height: 500, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
              <ItemContent
                data={card}
                onClick={() => {
                  setOpen(true);
                  setCurrentPost(card);
                }}
              />
            )
          );
        }}
      />
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Content className='flex max-w-[700px]'>
          <Modal.Header className='hidden'></Modal.Header>
          <Modal.Body className='flex w-full'>
            <div className='flex h-[90vh] w-full flex-col space-y-1 px-[30px] pb-[30px]'>
              <div className='mb-[20px] mt-[20px] text-title-h4 text-text-strong-950'>
                {currentPost?.frontMatter.title}
              </div>
              <div className='scrollbar-hide flex flex-1 flex-col overflow-y-scroll'>
                {currentPost?.frontMatter.cover && (
                  <Box className='mb-[20px] flex-shrink-0 overflow-hidden rounded-[14px]'>
                    <Image
                      src={currentPost.frontMatter.cover}
                      width={800}
                      height={200}
                      alt='picture'
                    />
                  </Box>
                )}
                <div
                  className='post-content w-full text-paragraph-sm text-text-sub-600'
                  dangerouslySetInnerHTML={{
                    __html: currentPost?.content ?? '',
                  }}
                ></div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className='hidden'>
            <Modal.Close asChild>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-full'
              >
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root size='small' className='w-full'>
              View Receipt
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
