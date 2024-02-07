# Wrap mutant. React. Rendered Array (beta)

[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Freact-rendered-array?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react-rendered-array)
[![minzip](https://img.shields.io/bundlephobia/minzip/%40wrap-mutant%2Freact-rendered-array?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react-rendered-array)
[![React Rendered Array](https://img.shields.io/badge/%40wrap--mutant%2Freact--rendered--array-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/tree/main/packages/react-rendered-array)
[![Github Issues](https://img.shields.io/github/issues/kai3341/wrap-mutant.svg?style=social&logo=github)](http://github.com/kai3341/wrap-mutant/issues)
[![Github Stars](https://img.shields.io/github/stars/kai3341/wrap-mutant)](http://github.com/kai3341/wrap-mutant)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/blob/main/LICENSE)
[![Telegram](https://img.shields.io/badge/Community-blue.svg?style=social&logo=telegram)](https://t.me/wrap_mutant/4)

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

## Examples (FIXME)

reactflow example [[demo](https://kai3341.github.io/d73bce02-46a1-4e59-895a-4863c2fc48f0/) | [repo](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0)]

- [/src/pages/projects/projects.tsx](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/pages/projects/projects.tsx)
- [/src/lib/statemgr.ts](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/lib/statemgr.ts)

---

This package is addition of [@wrap-mutant/react](../react) integration. To understand how actually it works please read the docs of [@wrap-mutant/core](../core) and [@wrap-mutant/react](../react).

This package is separated from [@wrap-mutant/react](../react) because of different release cycles and build targets.

# About

This package allows you avoid re-render of huge array of components and that's how you win the performance. It will be useful when you have to render large number of components without pagination, for example, in endless scroll (hello, LinkedIn, you are really slow) or when you render SVG.

I know API makes you think "not exactly what I want..." and you are right. But as engeneers we have to pay something to win something else. You have to implement small adapter component which prepare props for your target component.

Because of provided by this package `Array`s are already wrapped, it would be good to pass `{ wrap: false }` into `useWMState`'s options.

# Your skill requirement

This package requires you to understand how does `react` works in deep. It's not so hard. If I as python developer made it you can do it too.

# Pre-requirements

As I told earlier this package continues the idea of [@wrap-mutant/react](../react). Be sure you have read the docs.

# RenderedArray

Let's begin from minimal working example:

```typescript
import React, { useContext, useCallback } from "react";
import { useWMState, createMutableContext } from "@wrap-mutant/react";
import { RenderedArray } from "@wrap-mutant/react-rendered-array/array";

type MyModel = {
  // objects stored in your Array
};

type MyComponentProps = {
  model: MyModel;
  update: () => void;
  doSmth: (arg: any) => void;
  // other callbacks
};

const MyComponentCTX = createMutableContext({
  update: () => {},
  doSmth: (arg: any) => {},
});

const MyComponent = (props: MyComponentProps) => {
  return <>{/* Just your component render. Avoid using contexts here */}</>;
};

const MyAdapter = (props: MyModel) => {
  const ctx = useContext(MyComponentCTX); // DO NOT UNPACK IT
  return (
    <MyComponent
      model={props}
      update={() => ctx.update()} // DO NOT UNPACK IT
      doSmth={(arg) => ctx.doSmth(arg)} // DO NOT UNPACK IT
    />
  );
};

const recordFactory = RenderedArray({
  Component: MyAdapter,
  keyFunction: (item: MyModel) => item.key,
});

export const MyContainer = () => {
  // Don't forget to pass `wrap: false`
  const [records, updateRecords] = useWMState(recordFactory, { wrap: false });

  // prettier-ignore
  const update = useCallback(() => {/*whatever you need*/}, [/*deps*/]);

  // prettier-ignore
  const doSmth = useCallback((arg: any) => {/*whatever you need*/}, [/*deps*/]);

  return (
    <>
      <MyComponentCTX.Provider value={{ update, doSmth }}>
        {records.render()}
      </MyComponentCTX.Provider>
    </>
  );
};
```

This example provides both [@wrap-mutant/react](../react)'s and current package's `RenderedArray` APIs. But here we will talk about `RenderedArray`:

- **Required** options: `object`:

  - `Component`: **Required** react component to render each `Array`'s element
  - `keyFunction`: **Required** `function` generates `key` from your `Array`'s element
  - `count`: **Optional** `number` parameter meaning how many wrapper objects will be pre-created. More info at [@wrap-mutant/core API V2](../core#api-v2)

- **Returns** _already wrapped_ into `Proxy` object `Array`. Then you may mutate it as you want. Supported methods:

  - Assingment by index, e.g. `myArray[42] = {...something}`
  - `push`, `pop`, `shift`, `unshift`, `reverse`, `splice`, `sort`

# RenderedHeap (TODO)

_Requires to publish my fork of heap implementation_

More info about [heap data structure](<https://en.wikipedia.org/wiki/Heap_(data_structure)>). Actually it means always sorted `Array`. Very useful in graphics, but can be used everywhere you need always sorted data
