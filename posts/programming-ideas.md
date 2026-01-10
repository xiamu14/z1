---
title: 代码构思
description: 灵感乍现的代码构思
cover: https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### 代码构思

#### Dashboard schema (? Admin)

- 基于文件的路由（Tanstack route）
- Context 全局变量共享
- Component -> Organization -> Layout -> Page 全员 Schema 配置
- Less Code

#### di-fetch

- 完善 plugin 功能

  - RN 支持的 client 封装
  - 支持 msw.js

- Hooks 灵活配置，支持路由 Pattern 来控制路由是否经过这些 hook（Less Code）

#### react-formkit(原 react-nice-form)

- 支持 ArkType , zod 等 validation
- 将数据类型完善
