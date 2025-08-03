---
title: 构建类型安全的 API 函数
description: 通过 swagger api document 生成 API 函数
cover: https://images.pexels.com/photos/11035364/pexels-photo-11035364.jpeg
---

## 构建类型安全的 API 函数

### 安装依赖

```bash
bun add orval -D
bun add di-fetch swr
```

### 配置 orval

新建 .orval.config.js

```js
import { defineConfig } from 'orval';

export default defineConfig({
  v1: {
    output: {
      mode: 'tags',
      target: './src/api/generated/spec', // 配置路径
      schemas: './src/api/generated/model', // 配置路径
      client: 'swr',
      override: {
        mutator: {
          path: './src/api/fetch-transit.ts', // 配置路径
          name: 'fetchTransit',
        },
      },
      clean: true,
    },
    input: {
      target: 'xxx',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
```

新建 fetch-transit.ts 文件

```ts
// custom-instance.ts

import { HTTPErrors, fetchX as diFetch } from 'di-fetch';
import { Method } from 'di-fetch/build/type';

export const fetchTransit = async <Res>(options: {
  url: string;
  method: Method;
  params?: unknown;
  data?: unknown;
  headers?: unknown;
}): Promise<Res> => {
  const { url: path, params, data, method, ...restOptions } = options;

  const response = await diFetch({
    path,
    data: data || params,
    method,
    ...restOptions,
  });

  return response as Res;
};

export default fetchTransit;

// // In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ErrorType<Error> = HTTPErrors;
// // In case you want to wrap the body type (optional)
// // (if the custom instance is processing data before sending it, like changing the case for example)
export type BodyType<BodyData> = BodyData;
```

新增 fetch-engine.ts

```ts
import { Config } from '@/src/constants/envs';
import { fetch } from 'expo/fetch';
import getCustomUserAgent from '@/src/libs/getCustomUserAgent';
import { getCircularReplacer } from '@/src/utils/json';
import { Client, FetchEngine } from 'di-fetch';
import { ProcessedRequestOptions, RequestData } from 'di-fetch/build/type';

const client: Client = async <Request extends RequestData, Response>(
  req: ProcessedRequestOptions<Request>,
) => {
  const { url, method, data, ...restOptions } = req;
  const options: Record<string, any> = {
    method,
    ...restOptions,
  };

  // Ensure headers are properly cloned to avoid "Already in the pool!" error
  if (options.headers) {
    options.headers = { ...options.headers };
  }

  let fullUrl = url;

  if (['POST', 'PUT'].includes(method)) {
    if (data && !(data instanceof FormData)) {
      options.body = JSON.stringify(data, getCircularReplacer());
    } else {
      options.body = data;
    }
  }
  if (method === 'GET') {
    let queryString = '';
    if (data) {
      const searchParams = new URLSearchParams(data as Record<string, string>);
      queryString = `?${searchParams.toString()}`;
    }

    fullUrl = `${url}${queryString}`;
  }

  let response;
  try {
    response = await fetch(fullUrl, options);
  } catch (error) {
    throw error;
  }
  // const _response = response.clone();
  if (!response.ok) {
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      console.error('[parse response error]', error, response);
    }
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    const json = await response.json();
    return json;
  }
  if (response.headers.get('Content-Type')?.includes('text/plain')) {
    const text = await response.text();
    return text;
  }
  return response;
};

export const fetchEngine = new FetchEngine({
  baseUrl: Config.apiUrl!,
  client,
});
```

在 App 初始化文件引入 fetch-engine, 然后在用户登录后，注入 token 。

```ts
fetchEngine.setHeaders({
  authorization: `Bearer ${user.token}`,
});
```
