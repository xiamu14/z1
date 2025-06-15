import Link from 'next/link';
import * as Button from '@/components/ui/button';
import { RiGithubFill } from '@remixicon/react';
import { Posts } from '@/components/posts';
import { Center, VStack } from '@/components/ui/layouts';

export default function Home() {
  return (
    <Center className='w-screen'>
      <VStack className='mt-[140px] w-[800px] flex-col items-center'>
        <div className='mt-[30px] flex gap-4'>
          <Button.Root variant='neutral' asChild>
            <a
              href='https://github.com/alignui/alignui-nextjs-typescript-starter'
              target='_blank'
            >
              <Button.Icon as={RiGithubFill} />
              Give a star
            </a>
          </Button.Root>

          <Button.Root variant='neutral' mode='stroke' asChild>
            <Link href='https://alignui.com/docs' target='_blank'>
              Read our docs
            </Link>
          </Button.Root>
        </div>

        <div className='mt-[30px] w-full'>
          <Posts />
        </div>
      </VStack>
    </Center>
  );
}
