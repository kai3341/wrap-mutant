# Wrap mutant. React

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

---

This package contains react integration

# useWMState

> // Just this example is untested yet

```javascript
import React, { useCallback, useEffect, useState } from react;
import { useWMState } from "@wrap-mutant/react";

export const Blackboard = () => {
  const [ records, updateRecords ] = useWMState(() => [], { bind: true });
  const [ updateInterval, setUpdateInterval ] = useState(null);

  const writeRecord = useCallback(
    () => {
      records.push("I will not skateboard in the halls.");
      updateRecords(records);
    },
    [records, setRecords]
  );

  useEffect(
    () => {
      setUpdateInterval(setInterval(writeRecord, 250));
      return () => clearInterval(updateInterval);
    }
  );

  const renderedRecords = records.map(
    (item, index) => <div className="line" key={index}>{item}</div>
  );

  return <>{renderedRecords}</>;
};
```

API reference:

- **Required** factory `function`, passed directly [useMemo](https://react.dev/reference/react/useMemo#usememo)
- **Optional** options: `object`:
- - `deps`: **Optional** dependency `Array`, passed directly [useMemo](https://react.dev/reference/react/useMemo#usememo). **Default**: `[]`
- - `bind`: **Optional** `boolean` flag should we call utility `bindCallables` defined at [@wrap-mutant/util](https://github.com/kai3341/wrap-mutant/tree/main/packages/utils)

# Any questions?

Don't be afraid to open this library source code -- it's really small
