---
title: react-native 待整理问题
description: 日常开发中遇到的未完全解决的问题
cover: https://images.unsplash.com/photo-1620133026537-882224c4aeb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### keyboard and scrollView

在布局中有 textarea，且需要 scroll 时，使用 react-native-keyboard-controller 里的 KeyboardScrollView 组件嵌套 ScrollView 才能有键盘弹出后，页面整体可 scroll 的效果。

```tsx

```

### textarea 问题

使用非受控组件模式，textarea 更稳定，快速删除不闪屏。

#### 待处理

- 受控组件模式下，如何保持稳定？

- 高度随内容自适应逻辑，Android 上使用 onContentLayout 同步。iOS 暂无有效实现。

### react-native-navigation

1. header 问题，headerRight 里的组件有点击事件时，在部分手机必须使用 Pressable 组件的 onPressIn 事件，才能准确触发。

2. Screen 组件卸载问题，只有当 Screen 内调用 router.replace 时，Screen 才从内存里完全卸载释放。其余的无论时前进还是后退，Screen 都无法完全卸载，所有里面的 addEventListener 等订阅消息和事件必须要妥善的取消，否则增加内存消耗和导致逻辑错误。

### SafeAreaView

在使用 SafeAreaView 时，不要再直接嵌套 View.flex-1，否则会导致页面 flex-1 高度计算偶尔错误。错误示例：

```tsx
<SafeAreaView className='flex-1'>
  <View className='flex-1'> </View> // 不需要
</SafeAreaView>
```
