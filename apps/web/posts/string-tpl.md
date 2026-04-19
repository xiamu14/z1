---
title: 类型安全的字符串替换函数
description: 使用类型安全的字符串模板替换函数 - stringTpl
cover: https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## 类型安全的字符串替换函数

```typescript
type ExtractKeys<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param extends `${infer Name}?`
      ? Name | ExtractKeys<Rest>
      : Param | ExtractKeys<Rest>
    : never;

type OptionalKeys<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param extends `${infer Name}?`
      ? Name | OptionalKeys<Rest>
      : OptionalKeys<Rest>
    : never;

type ParamsFromTemplate<T extends string> =
  ExtractKeys<T> extends never
    ? undefined
    : {
        [K in ExtractKeys<T> as K extends OptionalKeys<T> ? K : never]?:
          | string
          | number;
      } & {
        [K in ExtractKeys<T> as K extends OptionalKeys<T> ? never : K]:
          | string
          | number;
      };

function stringTpl<T extends string>(
  template: T,
  params?: ParamsFromTemplate<T>,
): string {
  return template.replace(/{([^}]+)}/g, (_, rawKey: string) => {
    const isOptional = rawKey.endsWith('?');
    const key = isOptional ? rawKey.slice(0, -1) : rawKey;

    const val = (params as any)?.[key];
    if (val == null) {
      if (isOptional) return '';
      throw new Error(`Missing value for key: ${key}`);
    }
    return String(val);
  });
}
// console.log(stringTpl('/{id}/', { id: 12 }));
```
