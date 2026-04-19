---
title: 不需要使用 forwardRef
description: 将 ref 作为 props 传递是更优的方案。
cover: https://images.unsplash.com/photo-1448387473223-5c37445527e7?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### 关于 forwardRef 和 ts 泛型问题

参考
[forwardRef 泛型](https://fettblog.eu/typescript-react-generic-forward-refs/)

实践代码

```tsx
// Redeclare forwardRef
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

// Just write your components like you're used to!

type ClickableListProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
};
function ClickableListInner<T>(
  props: ClickableListProps<T>,
  ref: React.ForwardedRef<HTMLUListElement>,
) {
  return (
    <ul ref={ref}>
      {props.items.map((item, i) => (
        <li key={i}>
          <button onClick={(el) => props.onSelect(item)}>Select</button>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const ClickableList = React.forwardRef(ClickableListInner);
```

### 通过 props 传递多个 ref

ref 是 react 的保留字，所以通过 props 传递 ref 时，需要重新命名，比如:

```tsx

function Text({textRef:Ref<object>}) {

  useImpHandler(textRef, ()=>{
    return {}
  })
}

...
const textRef = useRef()
<Text textRef={textRef}>

```
