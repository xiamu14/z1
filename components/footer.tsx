import { Center, VStack } from './ui/layouts';

export default function Footer() {
  return (
    <VStack className='h-[200px] w-full justify-center gap-[20px] rounded-[6px] bg-[#fafafa] sm:h-[160px]'>
      <Center>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='/images/logo.svg'
          alt=''
          className='size-9 h-[40px] w-[40px] object-contain'
        />
      </Center>
      <Center>
        <p className='text-paragraph-sm'>Zen1 - Experience of Life</p>
      </Center>
    </VStack>
  );
}
