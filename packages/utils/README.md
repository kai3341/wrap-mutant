# Wrap mutant. Utils

[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Futils?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/utils)
[![minzip](https://img.shields.io/bundlephobia/minzip/%40wrap-mutant%2Futils?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/utils)
[![Utils solve some problems](https://img.shields.io/badge/%40wrap--mutant%2Futils-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/tree/main/packages/utils)
[![Github Issues](https://img.shields.io/github/issues/kai3341/wrap-mutant.svg?style=social&logo=github)](http://github.com/kai3341/wrap-mutant/issues)
[![Github Stars](https://img.shields.io/github/stars/kai3341/wrap-mutant)](http://github.com/kai3341/wrap-mutant)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/blob/main/LICENSE)
[![Telegram](https://img.shields.io/badge/Community-blue.svg?style=social&logo=telegram)](https://t.me/wrap_mutant)

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

## Examples

reactflow example [[demo](https://kai3341.github.io/d73bce02-46a1-4e59-895a-4863c2fc48f0/) | [repo](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0)]

- [/src/pages/projects/projects.tsx](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/pages/projects/projects.tsx)
- [/src/lib/statemgr.ts](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/lib/statemgr.ts)

---

This package contains utility toolbox created to simplify your life and this library usage and solve some regular problems

# bindCallables

Unfortunally there is a negative effect of wrapping objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object -- the wrapped object's methods loose their's `this`. So, if you have wrapped the object and got an error like `this is undefined` -- just bind the callables.

```javascript
import { bindCallables } from "@wrap-mutant/utils";
```

Avoid to bind callables of your target more then once

# Any questions?

Don't be afraid to open this library source code -- it's really small
