'use client';
import Link from 'next/link';
import { Center, HStack, VStack } from './ui/layouts';
import * as Button from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function Header() {
  const pathname = usePathname();
  const isShowSlogan = !pathname.includes('/post/');
  return (
    <VStack className='justify-center gap-[20px] bg-[#fafafa] rounded-[6px] w-full h-[360px] sm:h-[300px]'>
      <Center>
        <header className='flex justify-between items-center bg-white shadow-regular-sm p-[20px] rounded-[12px] w-[60%] min-w-[600px] max-w-[820px] h-[58px]'>
          <Link
            href='/'
            className='flex items-center gap-2 text-label-md text-text-strong-950'
          >
            <HStack className='items-center gap-[10px]'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='/images/logo.svg'
                alt=''
                className='w-[30px] h-[30px] size-9 object-contain'
              />
              <h2 className='font-bold text-[20px] sm:text-[18px]'>Zen1</h2>
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
            className='rounded-[4px] h-[30px]'
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
