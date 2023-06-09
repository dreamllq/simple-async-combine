# simple-async-combine

异步合并方法

## 安装

```
npm i simple-async-combine
```

## 依赖

- simple-deferred2


## 使用

### 相同参数调用

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
  let _args: number[] = [];
  const handle = asyncCombine((...args:number[]) => new Promise(resolve => {
    setTimeout(() => {
      _args = args;
      count++;
      resolve('aa');
    }, 2000);
  }));

  const results = await Promise.all([handle(1, 2), handle(1, 2)]);
  // count === 1
  // results === ['aa', 'aa']
  // _args = [1, 2]
```

### 忽略不同参数调用

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
  let _args: number[] = [];
  const handle = asyncCombine((...args:number[]) => new Promise(resolve => {
    setTimeout(() => {
      _args = args;
      count++;
      resolve('aa');
    }, 2000);
  }), { ignoreArguments: true });

  const results = await Promise.all([handle(1, 2), handle(2, 3)]);
  // count === 1
  // results === ['aa', 'aa']
  // _args = [1, 2]
```

### 混合情况参数调用

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
  const _args: number[][] = [];
  const handle = asyncCombine((...args:number[]) => new Promise(resolve => {
    setTimeout(() => {
      _args.push(args);
      count++;
      resolve(args);
    }, 2000);
  }));

  const results = await Promise.all([
    handle(1, 2),
    handle(1, 2),
    handle(2, 3)
  ]);

  // count === 2
  // results === [[1, 2],[1, 2],[2, 3]]
  // _args === [[1, 2], [2, 3]]
```