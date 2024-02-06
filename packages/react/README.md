# Wrap mutant. React

[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Freact?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react)
[![minzip](https://img.shields.io/bundlephobia/minzip/%40wrap-mutant%2Freact?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react)
[![React integration](https://img.shields.io/badge/%40wrap--mutant%2Freact-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/tree/main/packages/react)
[![Github Issues](https://img.shields.io/github/issues/kai3341/wrap-mutant.svg?style=social&logo=github)](http://github.com/kai3341/wrap-mutant/issues)
[![Github Stars](https://img.shields.io/github/stars/kai3341/wrap-mutant)](http://github.com/kai3341/wrap-mutant)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/blob/main/LICENSE)
[![Telegram](https://img.shields.io/badge/Community-blue.svg?style=social&logo=telegram)](https://t.me/wrap_mutant/4)

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

## Examples

reactflow example [[demo](https://kai3341.github.io/d73bce02-46a1-4e59-895a-4863c2fc48f0/) | [repo](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0)]

- [/src/pages/projects/projects.tsx](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/pages/projects/projects.tsx)
- [/src/lib/statemgr.ts](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/lib/statemgr.ts)

---

This package contains react integration. To understand how actually it works please read the docs of [@wrap-mutant/core](../core). Don't be afraid, it's small.

# useWMState

Classical example. We have avoided rebuilding on each render potencially large array. State update complexity does not depends on array size and always happens by `O(1)`

```typescript
import React, { useCallback, useEffect } from "react";
import { useWMState } from "@wrap-mutant/react";

const recordFactory = () => [] as string[];

export const Blackboard = () => {
  const [records, updateRecords] = useWMState(recordFactory, { bind: true });

  const writeRecord = useCallback(() => {
    records.push("I will not skateboard in the halls.");
    updateRecords();
  }, [records, updateRecords]);

  useEffect(() => {
    const interval = setInterval(writeRecord, 250);
    return () => clearInterval(interval); // eslint-disable-next-line
  }, []);

  const renderedRecords = records.map((item, index) => (
    <div className="line" key={index}>
      {item}
    </div>
  ));

  return <div className="board">{renderedRecords}</div>;
};
```

It's possible to avoid all loops in this component via pushing into records array rendered `JSX.Element` instead of string. But keep in mind it's dirty hack.

## API reference:

- **Required** factory `function`, passed directly [useMemo](https://react.dev/reference/react/useMemo#usememo)
- **Optional** options: `object`:
  - `deps`: **Optional** dependency `Array`, passed directly [useMemo](https://react.dev/reference/react/useMemo#usememo). **Default**: `[]`
  - `bind`: **Optional** `boolean` flag should we call utility `bindCallables` defined at [@wrap-mutant/util](../utils). **Default**: `false`. Read more explaination in [Pitfalls](#pitfalls) section
  - `args`: **Optional** `any` generic parameter passed into factory `function` (first parameter). Allows you to move complicated factory functions outside your `FunctionalComponent` closure to improve your code readability and performance
  - `wrap`: **Optional** `boolean` meaning should we [wrap](../core#api-v2) the target object or not. **Default**: `true`
  - `count`: **Optional** `number` parameter meaning how many wrapper objects will be pre-created. More info at [@wrap-mutant/core API V2](../core#api-v2)

---

# createMutableContext

Now I imagine you say "WAAAT?", but I'll explain :). This is auxiliary tool created for [rendered](#rendered) array-like objects _coming soon_. And if you think it's useless -- start from reading about [rendered](#rendered), and then welcome here.

In very short words MutableContext is the way to keep actual callbacks without element re-rendering. This is the only way to pass new callbacks into [rendered](#rendered) array-like objects without their's re-render.

Usage is absolutelly the same as regular context. Limitations:

- You have to pass `Object`-like value anyway even you have the only callback
- **NEVER** unpack this context. Read [How do JavaScript closures work?](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

```typescript
import { createMutableContext } from "@wrap-mutant/react";

const ReviewsItemCTX = createMutableContext({ updateItem: (diff: any) => {} });

const ItemRender = (props: Item) => {
  const ctx = useContext(ReviewsItemCTX); // <= DO NOT UNPACK
  return (
    <ReviewsItem item={props} updateItem={(diff) => ctx.updateItem(diff)} />
    // ALSO WRONG updateItem={ctx.updateItem}
  );
};

const Container = () => {
  // ... All code skept
  // prettier-ignore
  const updateItem = useCallback(
    (diff: any) => {/* do update state */},
    [/* requirements. Everything as usual */],
  );
  return (
    // Again. Context value have to be Object-like
    <ReviewsItemCTX.Provider value={{ updateItem }}>
      {/* children */}
    </ReviewsItemCTX.Provider>
  );
};
```

All these weird things are created to make possible implementation for [rendered](#rendered) array-like objects

---

# re-exports

## from [@wrap-mutant/core API V2](../core#api-v2):

```typescript
import { wrap, toggle, HasWrapperGen } from "@wrap-mutant/react";
```

- **function** `wrap` is renamed export of [@wrap-mutant/core](../core#api-v2)'s `wrapCached`
- **function** `toggle` is renamed export of [@wrap-mutant/core](../core#api-v2)'s `toggleCached`
- **type** `HasWrapperGen` is [@wrap-mutant/core](../core#api-v2)'s `HasWrapperGen`

## from [@wrap-mutant/utils](../utils):

```typescript
import { bindCallables } from "@wrap-mutant/react";
```

- **function** `bindCallables` is [@wrap-mutant/utils](../utils)'s `bindCallables`

---

# Pitfalls

Wrapped target object's methods behavior changes by [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object -- they loose their's `this`. There is an example:

```typescript
import { wrap } from "@wrap-mutant/react";

const A = wrap([] as number[]);
A.push(1, 2, 3, 4, 5); // <== throws an Error
A.forEach(concole.log); // <== throws an Error too
```

In this example `push` and `forEach` methods lost their's `this`. More commonly used `map` method also loose his `this`. Solution:

```typescript
import { wrap, bindCallables } from "@wrap-mutant/react";

const A = wrap(bindCallables([] as number[]));
A.push(1, 2, 3, 4, 5); // <== OK
A.forEach(concole.log); // <== OK
```

It means before `wrap`ping you have to apply `bindCallables` to target object. And exactly this is a meaning of `bind` option of [useWMState](#usewmstate) hook.

General rule sounds like:

> If you are calling methods of `wrap`ped object and you are sure these methods implementation is not an arrow function, you have to `bind callables` before `wrap`ping.

---

# Any questions?

Don't be afraid to open this library source code -- it's really small
