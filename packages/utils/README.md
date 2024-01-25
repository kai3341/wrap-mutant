# Wrap mutant. Utils

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy][MDNProxy] object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

---

This package contains utility toolbox created to simplify your life and this library usage and solve some regular problems

# bindCallables

Unfortunally there is a negative effect of wrapping objects into [Proxy][MDNProxy] object -- the wrapped object's methods loose their's `this`. So, if you have wrapped the object and got an error like `this is undefined` -- just bind the callables.

```
import { bindCallables } from "@wrap-mutant/utils";
```

Avoid to bind callables of your target more then once

# Any questions?

Don't be afraid to open this library source code -- it's really small

[MDNProxy]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
