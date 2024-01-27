# Wrap mutant. React

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

---

This package contains react integration

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
- - `deps`: **Optional** dependency `Array`, passed directly [useMemo](https://react.dev/reference/react/useMemo#usememo). **Default**: `[]`
- - `bind`: **Optional** `boolean` flag should we call utility `bindCallables` defined at [@wrap-mutant/util](https://github.com/kai3341/wrap-mutant/tree/main/packages/utils). **Default**: `false`
- - `args`: **Optional** `any` generic parameter passed into factory `function` (first parameter). Allows you to move complicated factory functions outside your `FunctionalComponent` closure to improve your code readability and performance
- - `count`: **Optional** `number` parameter meaning how many wrapper objects will be pre-created. More info at [@wrap-mutant/core API V2](https://github.com/kai3341/wrap-mutant/tree/main/packages/core#api-v2)

# Any questions?

Don't be afraid to open this library source code -- it's really small
