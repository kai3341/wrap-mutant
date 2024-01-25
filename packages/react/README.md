# Wrap mutant. React

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy][MDNProxy] object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

---

This package contains react integration

# Example

> // Just this example is untested yet

```
import React, { useCallback, useEffect, useState } from react;
import { useWMState } from "@wrap-mutant/react";
import { bindCallables } from "@wrap-mutant/utils";

export const Blackboard = () => {
  const [ records, updateRecords ] = useWMState(bindCallables([]));
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

# Any questions?

Don't be afraid to open this library source code -- it's really small

[MDNProxy]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
