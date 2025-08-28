---
title: Deferred：手动控制 Promise 的解决与拒绝
description: Deferred 函数让开发者可以灵活地在合适的时机手动触发 Promise 的 resolve 或 reject。它常用于测试场景，或在异步操作无法直接返回 Promise 的情况下，提供更强的控制能力。
cover: https://images.unsplash.com/photo-1595716887117-fd1add22a29b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### 自定义 deferred 函数，手动控制 resolve 和 reject

在 JavaScript 异步编程中，Promise 是核心工具，但有时我们需要更灵活的控制权。Deferred（延迟对象）让开发者能够在任意时机手动调用 resolve 或 reject，非常适合用于测试场景或处理不直接返回 Promise 的异步操作。代码如下：

```ts
type Code = 'CANCELLED' | 'TIMEOUT';
type CancelError = Error & { code?: Code; reason?: string };

function deferred<T>(timeout?: number) {
  let _resolve!: (value: T | PromiseLike<T>) => void;
  let _reject!: (reason?: unknown) => void;
  let _cancel!: (reason?: string, code?: Code) => void;
  let isCancelled = false;
  let cancelReason: string | undefined;
  let cancelCode: string | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const promise = new Promise<T>((resolve, reject) => {
    _resolve = (value) => {
      if (!isCancelled) {
        clearTimeout(timer);
        resolve(value);
      }
    };

    _reject = (err) => {
      if (!isCancelled) {
        clearTimeout(timer);
        reject(err);
      }
    };

    _cancel = (reason = 'Manual cancelled', code = 'CANCELLED') => {
      if (!isCancelled) {
        isCancelled = true;
        cancelReason = reason;
        cancelCode = code;

        clearTimeout(timer);

        const err = new Error(reason) as CancelError;
        err.code = code;
        err.reason = reason;

        reject(err);
      }
    };

    if (timeout != null) {
      timer = setTimeout(() => {
        _cancel(`Timeout after ${timeout}ms`, 'TIMEOUT');
      }, timeout);
    }
  });

  return {
    promise,
    resolve: _resolve,
    reject: _reject,
    cancel: _cancel,
    get cancelled() {
      return isCancelled;
    },
    get reason() {
      return cancelReason;
    },
    get code() {
      return cancelCode;
    },
  };
}
```

使用案例:

```ts
const d1 = deferred<string>();

setTimeout(() => {
  d1.resolve('12');
}, 2000);

d1.promise.then((value) => {
  console.log(value);
});
```
