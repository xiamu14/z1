---
title: React Native 应用开发解决方案
description: 掌握 RN 开发各种需求解决方案
cover: https://pica.zhimg.com/70/v2-2fa9b2dac5b217a1a22a5cb3b47c6a4f_1440w.avis?source=172ae18b&biz_tag=Post
---

## RN 开发常见需求

RN 应用开发常见需求整理如下：

- 自适应屏幕尺寸，根据屏幕尺寸自动缩放 UI 元素大小。解决方案：使用 nativeWind 里 `100vw` 等于 `screen.width` 的特性，使用 `pxToVw plugin`。
- i18n 国际化需求。解决方案：使用 `LingUI` 库，可以更方便在代码里实现多语言文本。
- 网络请求与路由。解决方案：使用 `expo-router` 定义路由。使用 openAPI 自动生成 `swr hook` 代码。
- 动画与 UX。解决方案：`react-native-reanimated`，正在积累更多实践。
- 打包与构建。解决方案：`expo run:android --device` , `expo run:ios --device`
- 高性能列表与 Tabs 切换列表。未解决。
- 虚拟键盘遮挡输入区问题。未解决。
- 图片请求/显示，、缓存。解决方案：`expo-image` ，正在积累更多实践。
- webview ，显示尺寸。解决方案：``。
- Modal 与 Toast。未解决。
- 测试用例。未解决。
- Android 应用隐私政策弹窗。解决方案：Android 原生端。
