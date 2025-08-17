---
title: expo-router 实践
description: 学习 expo-router, 基于文件构建应用的路由
cover: https://images.unsplash.com/photo-1667372335936-3dc4ff716017?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## expo-router 概念

在 项目目录 app 下的文件都与路由有关，`_layout.tsx` 、 `index.tsx` , 和`(tabs)`等

### app/\_layout.tsx

全局布局文件

### app/index.tsx

**应用首先渲染的页面**，也可以是位于 `app/(tabs)/index.tsx`。

### app/(tabs)/xxx.tsx

底部导航栏路由目录，可以使用 `app/(tabs)/_layout.tsx` 对底部导航栏做定制，修改 icons，name 等。

## 路由堆栈

### 前进

router.navigate, router.push, router.replace

### 后退

router.back, router.dismissTo

### 退出拦截

navigation.addEventListener('beforeRemove',()=>{})

## 路由参数

### 上下文

1. 通过 tabs 里的 active 判断当前激活的 Tab 页面

### 类型声明

```tsx
router.push<UserRouteParams>('/user', {});

const routeParams = useLocalParams<UserRouteParams>();
```

## 思考

思考 路由跳转时传递上下文（Context）而不是 query/params，特别是 大对象、复杂状态甚至临时数据，既要避免 URL 参数污染，又要避免无限制使用全局状态。

### 问题背景

- 传统路由参数
- 通常是字符串、数字、ID，适合小数据。
- 但大 JSON / File 对象 / Skia snapshot 等数据没法直接塞到 URL。
- 全局状态（Redux / Zustand / Valtio / Context）
- 可以存数据，但问题是：
- 数据和路由解耦，容易造成“僵尸状态”或内存泄露（页面关掉了，但数据还留着）。
- 很多状态只是「跳转时的临时上下文」，没必要长期存在。

所以需要一个 介于 params 和全局 store 之间的传递层。

### 方案思路：基于“导航上下文（Navigation Context）”

核心思想：

- 路由跳转时，生成一个 **上下文 ID**（比如 uuid）。
- 把 **大对象存放在一个上下文池（Map/WeakMap）** 中。
- 跳转时只传递这个 ID。
- 目标页面通过 ID 拿到上下文数据。
- 页面销毁时清理对应上下文，避免内存泄漏。

现有实现方案:

- React Router v6 的 location.state：能传 JS 对象，但不适合 RN。
- React Navigation 的 navigation.navigate("screen", { state })：也能传对象，但在 Android/iOS 大对象传递上不可靠（可能序列化失败）。

### 实现注意

- 避免全局状态污染（上下文自动清理）。
- 路由参数只存 轻量 ID，避免 query 过长。
- 数据不是可序列化的（刷新或重启 App 就丢了）。
- 多端共享时无法用 URL 直接还原（适合纯 App 内部跳转）。
- 需要小心清理机制，否则会内存泄漏。
- 可以实现一个 LRU Cache，存储最近的上下文，避免内存无限增长。
- 可以在 debug 环境下打印当前上下文池，方便排查泄漏。
