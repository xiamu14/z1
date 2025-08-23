---
title: React 的 createSyncState
description: 使用 createSyncState 和 useSyncState 获得同步最新状态
cover: https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## React 的 createSyncState

源码如下:

```ts
import { useSyncExternalStore } from 'react';

// -------------------- 自动 batch --------------------
const pending = new Set<State<any>>();
let scheduled = false;

function scheduleFlush() {
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(() => {
      const states = Array.from(pending);
      pending.clear();
      scheduled = false;
      states.forEach((s) => s.flush());
    });
  }
}

// -------------------- State 类 --------------------
class State<T> {
  private _value: T;
  private listeners = new Set<() => void>();
  _refCount = 0;
  // private dirty = false;

  constructor(initial: T) {
    this._value = initial;
  }

  get value(): T {
    return this._value;
  }

  set value(next: T | ((prev: T) => T)) {
    const newValue =
      typeof next === 'function' ? (next as (prev: T) => T)(this._value) : next;

    if (Object.is(newValue, this._value)) return;
    this._value = newValue;

    // 自动 batch: 收集待更新 state
    pending.add(this);
    scheduleFlush();
  }

  subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  flush() {
    this.listeners.forEach((l) => l());
  }

  hasSubscribers() {
    return this.listeners.size > 0;
  }
}

// -------------------- Scoped State 管理 --------------------
const scopes = new Map<symbol, State<any>>();

// -------------------- createSyncState --------------------
export function createSyncState<T>(initial: T, key?: symbol) {
  const stateKey = key ?? Symbol('global');
  let state = scopes.get(stateKey) as State<T>;

  if (!state) {
    state = new State(initial);
    scopes.set(stateKey, state);
  }

  return new (class {
    _state = state;
    get value() {
      return state!.value;
    }
    set value(v: T) {
      state!.value = v;
    }
  })();
}

// -------------------- useSyncState --------------------
export function useSyncState<T>(stateObj: { _state: State<T> }) {
  const state = stateObj._state;

  return useSyncExternalStore(
    (listener) => {
      const unsubscribe = state.subscribe(listener);
      state._refCount++;

      return () => {
        unsubscribe();
        state._refCount--;
        // 自动清理私域状态（非全局 key）
        if (
          state._refCount === 0 &&
          Object.getOwnPropertySymbols(stateObj)[0]
        ) {
          scopes.forEach((s, k) => {
            if (s === state) scopes.delete(k);
          });
        }
      };
    },
    () => state.value,
    () => state.value,
  );
}
```

使用示例：

```tsx
const globalCounter = createSyncState(0);
function App() {
  const count = useSyncState(globalCounter);
  return (
    <div>
      <p
        onClick={() => {
          globalCounter.value++;
          console.log(globalCounter.value); // 1
        }}
      >
        {count}
      </p>
    </div>
  );
}
```
