# Wrap mutant

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy][MDNProxy] object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

This is a root package. Subpackages:

- [Core](./packages/core/). Just core. Tiny and easy
- [Utils](./packages/utils/) solve some problems
- [React](./packages/react/) integration

[MDNProxy]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
