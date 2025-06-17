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
export default function MusicCard() {
  const { currentTrack, isPlaying, play, pause, next, prev, progressPercent } =
    useMusicPlayer({
      tracks: [
        {
          id: '1',
          title: '青花瓷',
          src: 'https://isure.stream.qqmusic.qq.com/C4000015zR8B3gjJLl.m4a?guid=734582561&vkey=C1C96736DF109A265C3A7AEEE9D04D498E0A3DC716A7900A44DF5C5EFF71F140398AA8FEF4216B4BE92C5D116E45483597E16788FFFA9663__v21ea05d38&uin=52161700&fromtag=120032',
          cover:
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ],
    });

  return (
    <div className='p-[8px]'>
      <VStack className='cursor-pointer items-center rounded-[10px] border bg-white p-[12px]'>
        <Center className='relative mb-[20px] h-[100px] w-full overflow-hidden rounded-[6px]'>
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
            <RiSkipBackFill color='#292929' />
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
                <RiPauseFill color='white' />
              ) : (
                <RiPlayFill color='white' />
              )}
            </Center>
            <RiSkipForwardFill color='#292929' />
          </HStack>
        </Center>
        <Center
          className={cn('mt-[10px] w-[80%] pb-[20px]', {
            hidden: progressPercent === 0,
          })}
        >
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
