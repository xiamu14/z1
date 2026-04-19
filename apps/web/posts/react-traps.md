---
title: 尽力躲避 React 中的陷阱
description: 介绍 React 开发过程中存在的各种陷阱，给出避开陷阱的实践方案
cover: https://images.unsplash.com/photo-1611701600139-0d468e20c9a1?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## React 的陷阱

本文整理各种 React 常见的陷阱，并深入探究陷阱背后的原因，最后有各种避开陷阱的可行实践方案。

### 用 && 运算符进行判断组件失败

当使用 && 运算符进行判断组件是否加载时，如果左值为 0（假值），最终结果只会显示 0，看看实验代码。

```tsx
import React from 'react';
import ShoppingList from './ShoppingList';

function App() {
  const [items, setItems] = React.useState([]);

  return <div>{items.length && <ShoppingList items={items} />}</div>;
}

export default App;
```

由于在JavaScript中 0 是一个假值，所以 && 运算符会短路，整个表达式的结果为 0 。表达式应该使用“纯粹”的布尔值（true/false），或使用三元运算符。

### 修改状态后访问状态是过期的

React 的 `useState` 的实现使得它返回的 `state` 只能在组件 `re-render`（Function Component 重新执行） 后才会更新。所以在 `setState` 执行后，立即通过 state 是无法获取到新值的。这一实现特性带来了陷阱。看看真实案例代码。

```tsx

export default function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const promiseResolverRef = useRef();
  const promiseRef = useRef(
    new Promise((resolve) => {
      promiseResolverRef.current = resolve;
    }),
  );

  const update = async () => {
    await sleep(1000);
    setTodos([1,2,3]);
    promiseResolverRef.current?.(true);
  };

  const postTodos = async () => {
    await promiseRef.current;
    console.log(todos); // [] , 仍然是空数组
  };

  return (
    <div >
      <div onClick={update}></div>
      <div onClick={postTodos}>
    </div>
  );
}

```

这里 `useState` 特性根本原因是每次返回的 `state` 都是新的值（值类型），而不是不可变的引用。所以 `setState` 执行后，`state` 只能在 `Component` 的 `re-render` 时才能更新到新的值。
这个陷阱在社区通常有另一种解释，被称为`过期闭包（stale closure）`。社区认为，在闭包创建后，所引用的外部作用域内的变量已经被修改，但闭包内仍然保存了旧值。看看社区引用实例。

```ts
function createIncrement(i) {
  let value = 0;
  function increment() {
    value += i;
    console.log(value);
    const message = `current value is ${value}`;
    return function logValue() {
      console.log(message); // 值传递，常量 message 定义时已经是 current value is 1
    };
  }
  return increment;
}
const inc = createIncrement(1);
const log = inc(); // 1
inc(); // 2;
log(); // "Current value is 1"
```

稍微修改下这个例子，可以看到其实与闭包无关。

```ts
function createIncrement(i) {
  let value = 0;
  function increment() {
    value += i;
    console.log(value);
    return function logValue() {
      console.log(`current value is ${value}`); // 不再传递，而是直接使用值
    };
  }
  return increment;
}
const inc = createIncrement(1);
const log = inc(); // 1
inc(); // 2;
log(); // "Current value is 2"
```

更详细的介绍可以参考 YouTube 视频[《Why "Stale Closure" Misleads React Devs》](https://www.youtube.com/watch?v=7yw_D3h4xSo)

现在有两种方案可以尽力避开这种陷阱。

#### 用 useRef 保存最新的 state

```ts
const [count, setCount] = useState(0);
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count; // 同步到不可变引用
}, [count]);

const handleClick = () => {
  setCount(count + 1);
  setTimeout(() => {
    // 延迟到 re-render 后
    console.log(countRef.current); // 已经同步 count
  }, 0);
};
```

#### 扩展 useState，增加同步状态值

```tsx
const countState = createSyncState(0)
function App() {
  const count = useSyncState(countState)

  return <div onClick={
    console.log('[before]',countState.value) // 0
    countState.value+=1
    console.log('[after]',countState.value) // 1
  }>{count}</div>
}
```

源码请查看[createSyncState](/post/Ymd7vD)

### 一次性事件与响应状态无法分离

一次性事件本来应该仅定义一次，然后通过订阅-发布模型运行。然后在 React 中，一旦事件里依赖了响应状态，就不得不依靠 Component re-render 来重新订阅获取最新状态的事件。如此，原本一次性事件就必须经历取消订阅，重新订阅。看看这个实例。

```tsx
const [todos, setTodos] = useState();
const handle = () => {
  console.log(todos);
};
useEffect(() => {
  // repeated binding
  window.addEventListener('keydown', handle);
  return window.removeEventListener(handle);
}, [todos]);
```

对于这个陷阱， React 团队曾试图给出 useEffectEvent（最初命名 useEvent），将订阅事件和响应状态分离。但目前 react 19 仍然没有包含这个 RFC。所以，只能自己实现一个版本，看看修正后代码。

```tsx
const [todos, setTodos] = useState();
const handle = useEffectEvent(() => {
  console.log(todos);
});
useEffect(() => {
  // once
  window.addEventListener('keydown', handle);
  return window.removeEventListener(handle);
}, [todos]);
```

useEffectEvent 返回的 handle 是不可变的引用，useEffectEvent 内部通过 useEffect 获取最新状态后再同步返回 handle 事件。源码请查看[useEffectEvent](/post/NfKK4r)
