import * as ProgressBar from './ui/progress-bar';
import { Center, HStack, VStack } from './ui/layouts';
import Image from 'next/image';
import {
  RiPlayFill,
  RiSkipForwardFill,
  RiSkipBackFill,
  RiPauseFill,
} from '@remixicon/react';
import { useMusicPlayer } from '@/libs/music-player/use-music-player';
import { cn } from '@/utils/cn';
import { tracks } from '@/data/tracks';
export default function MusicCard() {
  const { currentTrack, isPlaying, play, pause, next, prev, progressPercent } =
    useMusicPlayer({
      tracks,
      config: { loop: false },
    });

  return (
    <div className='cursor-default p-[8px]'>
      <VStack className='cursor-pointer items-center rounded-[10px] border bg-white p-[12px]'>
        <Center className='relative mb-[20px] h-[120px] w-full overflow-hidden rounded-[6px]'>
          <Image
            src={currentTrack.cover}
            fill
            style={{
              objectFit: 'cover', // 裁剪四周
              objectPosition: 'center', // 居中裁剪
            }}
            alt='music poster'
          />
        </Center>
        <h6 className='mb-[20px] font-bold text-static-black'>
          {currentTrack.title}
        </h6>
        <Center className='mb-[10px]'>
          <HStack className='items-center justify-center gap-[16px]'>
            <RiSkipBackFill color='#292929' onClick={prev} />
            <Center
              className='h-[30px] w-[30px] rounded-full bg-gray-800'
              onClick={() => {
                if (isPlaying) {
                  pause();
                } else {
                  play();
                }
              }}
            >
              {isPlaying ? (
                <RiPauseFill color='white' size={18} />
              ) : (
                <RiPlayFill color='white' size={18} />
              )}
            </Center>
            <RiSkipForwardFill color='#292929' onClick={next} />
          </HStack>
        </Center>
        <Center className={cn('mt-[10px] w-[80%] pb-[20px]')}>
          <ProgressBar.Root
            value={progressPercent}
            max={100}
            className='overflow-hidden'
            extraClassName='bg-[#292929]'
          ></ProgressBar.Root>
        </Center>
      </VStack>
    </div>
  );
}
