---
title: 在 RN 中使用 pxToVw 函数
description: 通过 nativewind 对 vw 的支持，提供自适应页面转换
cover: https://liblibai-online.liblib.cloud/community-img/241119877-90c432f5d7c9fa97cb1dfda51d4c88d241cd1bce4eb07666173ef80546fb49a7.png?x-oss-process=image/resize,w_764,m_lfit/format,webp
---

## 在 RN 中使用 pxToVw 函数

pxToVw 函数：

```js
// plugins/px-to-vw.js

export default function pxToVwPlugin({ matchUtilities }) {
  const designWidth = 414; // NOTE: 根据设计稿尺寸配置

  const toVW = (value) => {
    const px = parseFloat(value);
    const vw = ((px / designWidth) * 100).toFixed(3);
    return `${vw}vw`;
  };

  // width
  matchUtilities(
    {
      w: (value) => {
        if (!value.endsWith('px')) return {};
        return { width: toVW(value) };
      },
    },
    {
      values: { '*': '' },
      type: 'length', // ✅ 防止歧义：明确为 length 类型
    },
  );

  // height
  matchUtilities(
    {
      h: (value) => {
        if (!value.endsWith('px')) return {};
        return { height: toVW(value) };
      },
    },
    {
      values: { '*': '' },
      type: 'length',
    },
  );

  // fontSize
  matchUtilities(
    {
      text: (value) => {
        if (!value.endsWith('px')) return {};
        return { fontSize: toVW(value) };
      },
    },
    {
      values: { '*': '' },
      type: 'length',
    },
  );

  // borderRadius
  matchUtilities(
    {
      rounded: (value) => {
        if (!value.endsWith('px')) return {};
        return { borderRadius: toVW(value) };
      },
    },
    {
      values: { '*': '' },
      type: 'length',
    },
  );
}
```

在 tailwind.config.js 中配置插件

```js
import pxToVwPlugin from "./pxToVw";
...
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [..., pxToVwPlugin],
}
```
