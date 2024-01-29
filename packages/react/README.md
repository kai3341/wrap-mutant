# Wrap mutant. React

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

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
  - `count`: **Optional** `number` parameter meaning how many wrapper objects will be pre-created. More info at [@wrap-mutant/core API V2](../core#api-v2)

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

> If you are calling methods of `wrap`ped object and you are sure these methods implementation is not an arrow function, you have have to `bind callables` before `wrap`ping.

# Any questions?

Don't be afraid to open this library source code -- it's really small
