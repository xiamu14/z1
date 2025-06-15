'use client';

import { VirtuosoMasonry } from '@virtuoso.dev/masonry';
import { useEffect, useMemo, useState } from 'react';
import { Box, HStack, VStack } from './ui/layouts';
import { Divider } from './ui/divider';
import * as Modal from './ui/modal';
import * as Button from './ui/button';

import { RiCheckboxCircleFill } from '@remixicon/react';
import Image from 'next/image';
const ItemContent: React.FC<{ data: number; onClick: () => void }> = ({
  data,
  onClick,
}) => {
  return (
    <div className='p-[8px]' onClick={onClick}>
      <VStack className='cursor-pointer rounded-[10px] border bg-white p-[24px]'>
        <HStack className='h-[18px] items-center gap-[10px]'>
          <div className='h-full w-[4px] rounded-xl bg-primary-base'></div>
          <h3 className='font-bold text-static-black'>CSS : flex 规则</h3>
        </HStack>
        <Divider className='my-[20px]' />
        <Box>
          设置元素的宽度等于父容器剩余内容的宽度时，要给元素添加
          `overflow:hidden`，避免元素被子元素撑开。
        </Box>

        <Box className='mt-[20px] overflow-hidden rounded-[14px]'>
          <Image
            src={
              'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            width={500}
            height={500}
            alt='picture'
          />
        </Box>
      </VStack>
    </div>
  );
};

export function Posts() {
  const data = useMemo(() => {
    return Array.from({ length: 200 }, (_, index) => index);
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <div className='scroll-smooth'>
      <VirtuosoMasonry
        columnCount={3}
        data={data}
        style={{ height: 500, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        initialItemCount={50}
        ItemContent={(data: any) => (
          <ItemContent
            data={data}
            onClick={() => {
              setOpen(true);
            }}
          />
        )}
      />
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Content className='max-w-[600px]'>
          <Modal.Header className='hidden'></Modal.Header>
          <Modal.Body className='flex items-start gap-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-10 bg-success-lighter'>
              <RiCheckboxCircleFill className='size-6 text-success-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-label-md text-text-strong-950'>
                Payment Received
              </div>
              <div className='text-paragraph-sm text-text-sub-600'>
                Your payment has been successfully received. You have unlocked
                premium services now.
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
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
