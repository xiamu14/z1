---
title: 增强 React 开发体验和代码维护性
description: 增强 hook 语义化，杜绝无效的 re-render
cover: https://images.unsplash.com/photo-1687603917313-ccae1a289a9d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

## 增强 React 开发体验和代码维护性

在使用 React 开发时，强制约束原生 Hook(比如useEffect, useState) 的使用方式，使用更有语义的替代方案。并且将 **纯 UI 状态** 和 **非纯 UI 响应式状态**严格分离，在 react Function Component 中只包含 **纯 UI 状态**，任何具有副作用的**非纯 UI 状态**，使用 jotai 或 valtio 等现代状态管理库进行管理，同时实现响应式功能（比如提交表单，自动触发操作等）

### 1. 限制 React 原生 Hook 的直接使用

```js
// eslint-rules/no-raw-react-hooks.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        '禁止直接使用 React 原生 Hooks，使用团队定义的语义化 Hooks 代替;禁止在 JSX props 中直接传入会导致不必要 re-render 的值',
    },
    schema: [],
    messages: {
      noRawHook: '禁止直接使用 {{ name }}，请使用团队定义的语义化 Hook 代替。',
      unstableProp:
        '不要在 props 中直接传入 {{ type }}，请将其提取到 useMemo/useCallback 或常量。',
    },
  },
  create(context) {
    const bannedHooks = ['useEffect', 'useState', 'useContext'];
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'react') {
          for (const specifier of node.specifiers) {
            if (
              specifier.imported &&
              bannedHooks.includes(specifier.imported.name)
            ) {
              context.report({
                node: specifier,
                messageId: 'noRawHook',
                data: { name: specifier.imported.name },
              });
            }
          }
        }
      },
      JSXAttribute(node) {
        if (!node.value) return;
        const v = node.value.expression;

        // { foo: 'bar' } 或 [1,2,3]
        if (v?.type === 'ObjectExpression' || v?.type === 'ArrayExpression') {
          context.report({
            node,
            messageId: 'unstableProp',
            data: {
              type: v.type === 'ObjectExpression' ? '对象字面量' : '数组字面量',
            },
          });
        }

        // () => {}
        if (
          v?.type === 'ArrowFunctionExpression' ||
          v?.type === 'FunctionExpression'
        ) {
          context.report({
            node,
            messageId: 'unstableProp',
            data: { type: '函数' },
          });
        }
      },
    };
  },
};
```

在 .eslintrc.js 里加：

```js
module.exports = {
  plugins: ['custom'],
  rules: {
    'custom/no-raw-react-hooks': 'error',
  },
};
```

### 2. 定义语义化 Hooks

`useUIState` - 仅更新 UI 的状态值，不包含任何副作用

```ts
export const useUIState = useState;
```

`useOnce` - 仅执行一次，无任何依赖

```ts
const useOnce = (effect: EffectCallback) => {
  useEffect(effect, []);
};
```

`useMount` - 加载时执行一次

```ts
export const useMount = useOnce;
```

`useUnmount` - 卸载时执行一次

```ts
export const useUnmount = (fn: () => void): void => {
  const fnRef = useRef(fn);
  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useOnce(() => () => fnRef.current());
};
```

`useUpdateReason` - 导致组件 render 的状态更变

```ts
type Props = Record<string, unknown>;
export function useUpdateReason(
  componentName: string,
  props: Props,
  debug = true,
) {
  const prevProps = useRef<Props>({});

  useEffect(() => {
    if (prevProps.current && debug) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: Props = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[component update reason]', componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
}
```

### 3. 自定义 useEffectReact

```ts
import { useCallback, useEffect, useRef } from 'react';

export function useEffectEvent<T extends (...args: unknown[]) => unknown>(
  fn: T,
): T {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, []);
  return useCallback(((...args) => ref.current(...args)) as T, []);
}
```

### 结论

这套架构的最大价值在于：把“容易出错的自由度”收紧为“可读、可控、可优化的约束”，让性能与可维护性更可预期；代价是与生态的摩擦、工具与适配的维护成本，以及对团队习惯的改造。若能按“分阶段推进 + 适配层 + 作用域 store + DevTools”四件套去落地，优势会逐步显现，而缺陷也能被控制在工程可接受范围内。
