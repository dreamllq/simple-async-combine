// https://jestjs.io/zh-Hans/docs/api

import asyncCombine from '@/index';

test('base', async () => {
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

  expect(count).toEqual(1);
  expect(results).toEqual(['aa', 'aa']);
  expect(_args).toEqual([1, 2]);
});

test('ignoreArguments', async () => {
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

  expect(count).toEqual(1);
  expect(results).toEqual(['aa', 'aa']);
  expect(_args).toEqual([1, 2]);
});

test('混合', async () => {
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

  expect(count).toEqual(2);
  expect(results).toEqual([
    [1, 2],
    [1, 2],
    [2, 3]
  ]);
  expect(_args).toEqual([[1, 2], [2, 3]]);
});