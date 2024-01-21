# Wrap mutant

Object mutation is easy and extremelly fast. But such libraries like react make
us rebuild objects on every their change. It's not a problem on simple and small
objects. When your object is a big array, your application become slow. When you
are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)[Proxy] object.

TODO: create an example application aimed to explain how to use this library and
benchmarking

# Idea explaination on API V1

This API is naive and very easy to explain the root idea, but I see no reason to
use it on the production

```
import React, { useState, useCallback } from react;
// import { wrap, rewrap } from "wrap-mutant"; // works too
import { wrap, rewrap } from "wrap-mutant/simple";
import { bindCallables } from "wrap-mutant/utils/bind-callables";

export const Blackboard = () => {
  const [ records, setRecords ] = useState(wrap(bindCallables([])));

  const writeRecord = useCallback(
    () => {
      records.push("I will not skateboard in the halls.");
      setRecords(rewrap(records));
    },
    [records, setRecords]
  );

  return records.map(
    (item, index) => <div className="line" key={index}>{item}</div>
  )
};
```

# API V2

And I hope just this API you will use in you production. Usage is almost the
same, but it works in a bit different way. Instead of creating new Proxy object
on each mutation we can pre-create batch Proxy objects and then rotate tham via
roundrobin algothythm. I mean the cost of the each reference update becomes a
zero.

```
// import { wrap, rewrap } from "wrap-mutant/simple";
import { wrapCached, toggleCached } from "wrap-mutant/caching";
```

Difference between `wrap` and `wrapCached` usage is the `wrapCached` accepts
additional argument `count` meaning how many Proxy objects will be created.
And `toggleCached` usage is the same as `rewrap`

# Additional API

Some API is universal

## unwrap

Allows to extract wrapped object

```
import { unwrap } from "wrap-mutant/unwrap";
```

## clean

Cleanup the object from this library additional fields

```
import { clean } from "wrap-mutant/clean";
```

# Utils

Utility toolbox created to simplify your life and this library usage

# bindCallables

Unfortunally there is a negative effect of wrapping objects into Proxy -- the
wrapped object's methods loose their's `this`. So, if you wrapped object and got
an error like `this is undefined` -- just bind the callables

```
import { bindCallables } from "wrap-mutant/utils/bind-callables";
```

# Any questions?

Don't be afraid to open this library source code -- it's really small
