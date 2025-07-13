'use client';
import Link from 'next/link';
import { Center, HStack, VStack } from './ui/layouts';
import * as Button from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function Header() {
  const pathname = usePathname();
  const isShowSlogan = !pathname.includes('/post/');
  console.log('isShowSlogan', isShowSlogan, pathname);
  return (
    <VStack className='h-[360px] w-full justify-center gap-[20px] rounded-[6px] bg-[#fafafa] sm:h-[300px]'>
      <Center>
        <header className='flex h-[58px] w-[60%] min-w-[600px] max-w-[820px] items-center justify-between rounded-[12px] bg-white p-[20px] shadow-regular-sm'>
          <Link
            href='/'
            className='flex items-center gap-2 text-label-md text-text-strong-950'
          >
            <HStack className='items-center gap-[10px]'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/images/logo.svg'
                alt=''
                className='size-9 h-[30px] w-[30px] object-contain'
              />
              <h2 className='text-[20px] font-bold sm:text-[18px]'>Zen1</h2>
            </HStack>
          </Link>
          <Center className='gap-[30px]'>
            <Button.Root variant='neutral' mode='ghost'>
              <Link href='/'>Home</Link>
            </Button.Root>
            <Button.Root variant='neutral' mode='ghost'>
              Category
            </Button.Root>
            <Button.Root variant='neutral' mode='ghost'>
              Tools
            </Button.Root>
          </Center>
          <Button.Root
            mode='lighter'
            variant='primary'
            className='h-[30px] rounded-[4px]'
          >
            NewsLetter
          </Button.Root>
        </header>
      </Center>

      <Center className={cn({ 'opacity-0': !isShowSlogan })}>
        <h1 className='mt-[20px] text-title-h2'>Inspiration and Creativity</h1>
      </Center>
      <Center className={cn({ 'opacity-0': !isShowSlogan })}>
        <p className='text-paragraph-md'>{`“100 life experience, endless inspiration and creativity”`}</p>
      </Center>
    </VStack>
  );
}
