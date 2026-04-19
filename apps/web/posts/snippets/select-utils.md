---
title: Select 组件工具类
description: 为 Select 组件添加复合数据枚举
cover: https://images.unsplash.com/photo-1743862558369-5dcea79ccbff?q=80&w=3007&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

### 介绍

在实际开发中，常常会遇到同一个枚举在不同场景下需要展示不同信息的情况。例如，后端定义了一组服务类型枚举，前端则可能需要为每个类型补充名称、描述或状态等额外属性。
此时，可以通过专门的工具类，对这些复杂枚举对象进行统一的数据转换和读取，简化前端的处理逻辑，提高代码的可维护性和复用性。

```ts
/**
 * @desc 多值选择类
 */
import _isEqual from 'lodash.isequal';

export default class Select<T extends Record<string, any>> {
  data: T[];

  /**
   * 定义具有多值的枚举属性类
   * @param data
   */
  constructor(data: T[]) {
    this.data = data;
  }

  /**
   * 获取数组中此键名的值组成的数组
   * @param key
   */
  values(key: keyof T) {
    const result = this.data.map((item) => item[key]);
    return result;
  }

  /**
   * 根据特定的 key value 获取到数组子项
   * @param key
   * @param val
   */

  item(key: keyof T, value: T[typeof key]) {
    const result = this.data.find((item: T) => _isEqual(item[key], value));
    return result;
  }
}
```

### 🐠使用方式

```ts
const fruits = [
  {
    id: 0, // 数组 index 显式表达为 id
    desc: '苹果', // 前端展示的描述值
    endValue: 1, // 后端值
  },
  {
    id: 1,
    desc: '橘子',
    endValue: 2,
  },
  {
    id: 2,
    desc: '桃花',
    endValue: 3,
  },
];
const fruitSelect = new Select(fruits);

// 获取所有的 desc ，返回数组
fruitSelect.values('desc'); // ['苹果', '橘子', '桃花']

// 根据特定的 kev-val 获取子项
fruitSelect.item('id', 1);
// {id:1, desc: '橘子', endValue: 2,}
```
