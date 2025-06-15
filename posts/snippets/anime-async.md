---
title: 优化异步等待动画的辅助函数
description: 为异步等待动画增加最小显示时间，避免动画闪烁出现消失
cover: https://images.unsplash.com/photo-1631582053308-40f482e7ace5?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### 优化异步等待动画的 Hook

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

enum State {
  RUNNING,
  FINISHED,
}

export default function useAnimeAsync({
  delay,
  period,
  onRun,
  onFinish,
  debug,
}: {
  delay: number;
  period: number;
  onRun: () => void;
  onFinish: () => void;
  debug?: boolean;
}) {
  const [state, setState] = useState<State>();
  const startRef = useRef<number>(0);
  const delayRef = useRef<number>(delay);
  const periodRef = useRef(period);
  const debugRef = useRef(debug);
  const startTimerRef = useRef<number>();

  const start = useCallback(() => {
    if (state === undefined) {
      startTimerRef.current = setTimeout(() => {
        if (state === undefined) {
          setState(State.RUNNING);
          startRef.current = Date.now();
          onRun();
        }
      }, delayRef.current);
    }
  }, [onRun, state]);

  useEffect(() => {
    if (state === State.FINISHED) {
      if (debugRef.current && startRef.current) {
        console.log('--running time', Date.now() - startRef.current);
      }
      onFinish();
      setState(undefined);
      clearTimeout(startTimerRef.current);
    }
  }, [state, onFinish]);

  const stop = useCallback(() => {
    if (state === State.RUNNING) {
      const runTime = Date.now() - startRef.current;
      const duration =
        runTime < periodRef.current
          ? periodRef.current - runTime
          : periodRef.current - (runTime % periodRef.current);
      if (debugRef.current) {
        console.log(
          '--duration',
          runTime,
          periodRef.current % runTime,
          duration,
        );
      }
      if (duration > 0) {
        // TODO: 完成动画周期
        setTimeout(() => {
          setState(State.FINISHED);
        }, duration);
      } else {
        setState(State.FINISHED);
      }
    } else if (state === undefined) {
      setState(State.FINISHED);
    }
  }, [state]);

  return { stop, start };
}
```

### 🐠 使用方式

```ts
import { useEffect } from 'react';
import useAnimeAsync from './use_delay_anime';

export default function App() {
  const { start, stop } = useAnimeAsync({
    delay: 300, // 设置等待时间 ms
    period: 300, // 设置动画周期时长 ms
    onRun: () => {
      // 等待时间到达时，没有触发 stop ，则触发
      console.log('触发动画');
    },
    onFinish: () => {
      // stop 触发完成（会补充动画周期）
      console.log('触发结束');
    },
    debug: true, // 开启会打印时间信息
  });

  useEffect(() => {
    start(); // 启动延迟等待动画
    setTimeout(() => {
      stop(); // 异步动作完成时停止延迟动画
    }, 400);
  }, [stop]);

  return <div className="App"></div>;
}
```
