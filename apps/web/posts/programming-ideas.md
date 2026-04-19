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

#### State Machine Animation Manager
基于状态机的动画控制器

#### expo-cache

使用接口模式实现多种资源文件的三级缓存

- 三级缓存 ：本地-内存-网络
- 接口模式对接不同资源的加载，校验
- 使用多层级控制来分组按需清理（global ， [project]/audio/这样）

#### Task-Manager-Model

任务控制器模型
- 串行异步任务 pipeline
- 随时中断缓存、续做、重启
- 进度控制显示
- 灵活任务定义调度
