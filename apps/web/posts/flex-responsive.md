---
title: CSS 灵活的自适应宽高
description: 子元素如何自适应自身宽高或继承父元素 flex:1 的元素等
cover: https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## Flex 的自适应

`flex:1` 可以实现继承父元素剩余高度。

### flex 防溢出

当设置元素的宽度等于父容器剩余内容的宽度时，要给元素添加 `overflow:hidden`，避免元素被子元素撑开。

### flex:1 剩余空间多重继承

设置元素的高度等于父容器剩余内容的高度时，同时父容器也是通过 `flex-grow:1` 获得其父容器高度时，则该父容器必须添加 `height:0` (值不影响)
