# simple-async-combine

异步调用合并。当多个调用者同时发起相同参数的异步请求时，只执行一次，所有调用者共享同一结果。

典型场景：

- 多个组件同时请求同一份接口数据
- 防止重复的并发 API 调用
- 对并发异步操作进行去重

## 安装

```bash
npm i simple-async-combine
```

## API

### `asyncCombine(fn, options?)`

将一个异步函数包装为可合并调用的版本。

**参数：**

- `fn` - 需要包装的异步函数
- `options.ignoreArguments` - `boolean`，默认 `false`。设为 `true` 时，忽略参数差异，所有并发调用都会被合并为一次执行

**返回值：** 与原函数签名相同的包装函数，调用后返回 `Promise`。

## 使用示例

### 相同参数的并发调用

多次传入相同参数时，函数只执行一次，所有调用者拿到相同结果。

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
let _args: number[] = [];

const handle = asyncCombine((...args: number[]) => new Promise(resolve => {
  setTimeout(() => {
    _args = args;
    count++;
    resolve('aa');
  }, 2000);
}));

const results = await Promise.all([handle(1, 2), handle(1, 2)]);

// count === 1              // 函数只执行了一次
// results === ['aa', 'aa'] // 两个调用者拿到了相同结果
// _args === [1, 2]
```

### 忽略参数差异

开启 `ignoreArguments` 后，即使参数不同也会合并为一次调用。执行时使用第一次调用的参数。

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
let _args: number[] = [];

const handle = asyncCombine((...args: number[]) => new Promise(resolve => {
  setTimeout(() => {
    _args = args;
    count++;
    resolve('aa');
  }, 2000);
}), { ignoreArguments: true });

const results = await Promise.all([handle(1, 2), handle(2, 3)]);

// count === 1              // 参数不同也被合并
// results === ['aa', 'aa']
// _args === [1, 2]         // 使用第一次调用的参数
```

### 混合参数的并发调用

不同参数的调用各自分组合并，相同参数共享同一次执行。

```ts
import asyncCombine from 'simple-async-combine';

let count = 0;
const _args: number[][] = [];

const handle = asyncCombine((...args: number[]) => new Promise(resolve => {
  setTimeout(() => {
    _args.push(args);
    count++;
    resolve(args);
  }, 2000);
}));

const results = await Promise.all([
  handle(1, 2),
  handle(1, 2),
  handle(2, 3),
]);

// count === 2                            // 分为两组: [1,2] 和 [2,3]
// results === [[1, 2], [1, 2], [2, 3]]  // 每个调用者拿到对应结果
// _args === [[1, 2], [2, 3]]            // 实际执行了两次
```

## License

MIT
