// hooks/useMusicPlayer.ts
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Howl } from 'howler';
import { Track } from './types';

export function useMusicPlayer({ tracks }: { tracks: Track[] }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const seekRef = useRef<number>(0); // 记录断点位置

  const currentTrack = tracks[trackIndex];

  const progressPercent = useMemo(() => {
    const duration = soundRef.current?.duration?.() || 0;
    return duration > 0 ? (progress / duration) * 100 : 0;
  }, [progress]);

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startProgressTracking = () => {
    clearProgressInterval();
    intervalRef.current = setInterval(() => {
      if (soundRef.current?.playing()) {
        setProgress(soundRef.current.seek() as number);
      }
    }, 500);
  };

  // 播放当前或指定索引曲目，支持断点续播
  const play = (index = trackIndex) => {
    const isSameTrack = index === trackIndex;
    const existingSound = soundRef.current;

    // 如果当前是同一曲目且暂停了 => 恢复播放
    if (isSameTrack && existingSound && !existingSound.playing()) {
      existingSound.seek(seekRef.current || 0);
      existingSound.play();
      setIsPlaying(true);
      startProgressTracking();
      return;
    }

    // 否则创建新 sound 播放
    if (existingSound) {
      existingSound.stop();
    }

    const sound = new Howl({
      src: [tracks[index].src],
      html5: true,
      loop: loop,
      onend: handleNext,
    });

    soundRef.current = sound;
    seekRef.current = 0;
    sound.play();
    setTrackIndex(index);
    setIsPlaying(true);
    startProgressTracking();
  };

  const pause = () => {
    if (soundRef.current) {
      seekRef.current = soundRef.current.seek() as number;
      soundRef.current.pause();
      setIsPlaying(false);
      clearProgressInterval();
    }
  };

  const resume = () => {
    play(trackIndex); // 恢复逻辑已整合在 play 中
  };

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      seekRef.current = 0;
      setIsPlaying(false);
      clearProgressInterval();
      setProgress(0);
    }
  }, []);

  const seek = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setProgress(time);
      seekRef.current = time;
    }
  };

  const handleNext = () => {
    const nextIndex = (trackIndex + 1) % tracks.length;
    setTrackIndex(nextIndex);
    seekRef.current = 0;
    play(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    setTrackIndex(prevIndex);
    seekRef.current = 0;
    play(prevIndex);
  };

  const toggleLoop = () => {
    const newLoop = !loop;
    setLoop(newLoop);
    if (soundRef.current) {
      soundRef.current.loop(newLoop);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    currentTrack,
    isPlaying,
    progress,
    progressPercent,
    duration: soundRef.current?.duration() || 0,
    play,
    pause,
    resume,
    stop,
    seek,
    next: handleNext,
    prev: handlePrev,
    toggleLoop,
    loop,
  };
}
