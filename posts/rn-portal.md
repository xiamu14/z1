---
title: RN 的 Portal 组件
description:
cover: https://images.pexels.com/photos/32862970/pexels-photo-32862970.jpeg
---

## React Native 的 Portal 组件

代码组件文件

```bash
.
├── Portal.tsx
├── PortalContext.tsx
└── PortalHost.tsx
```

### PortalHost.tsx

```tsx
// portal/PortalHost.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { PortalContext } from './PortalContext';

export function PortalHost({ children }: { children?: React.ReactNode }) {
  const nextKey = useRef(0);
  const [portals, setPortals] = useState<
    { key: number; children: React.ReactNode }[]
  >([]);

  const mount = useCallback((key: number, children: React.ReactNode) => {
    setPortals((prev) => [...prev, { key, children }]);
  }, []);

  const update = useCallback((key: number, children: React.ReactNode) => {
    setPortals((prev) =>
      prev.map((item) => (item.key === key ? { ...item, children } : item)),
    );
  }, []);

  const unmount = useCallback((key: number) => {
    setPortals((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const contextValue = useRef({ mount, update, unmount }).current;

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
      {portals.map(({ key, children }) => (
        <View
          key={key}
          style={StyleSheet.absoluteFill}
          // pointerEvents="box-none"
        >
          {children}
        </View>
      ))}
    </PortalContext.Provider>
  );
}
```

### Portal.tsx

```tsx
// portal/Portal.tsx
import React, { useContext, useEffect, useRef } from 'react';
import { PortalContext } from './PortalContext';

let globalKey = 0;

export function Portal({ children }: { children: React.ReactNode }) {
  const manager = useContext(PortalContext);

  if (!manager) {
    throw new Error('Portal must be rendered inside a PortalHost');
  }

  const keyRef = useRef<number>(globalKey++);
  const key = keyRef.current;

  useEffect(() => {
    manager.mount(key, children);
    return () => manager.unmount(key);
  }, [children, key, manager]);

  useEffect(() => {
    manager.update(key, children);
  }, [children, key, manager]);

  return null;
}
```

### PortalContext.tsx

```tsx
// portal/PortalContext.tsx
import React from 'react';

export const PortalContext = React.createContext<{
  mount: (key: number, children: React.ReactNode) => void;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
} | null>(null);
```
