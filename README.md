# Wrap mutant

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/blob/main/LICENSE)
[![Telegram](https://img.shields.io/badge/Community-blue.svg?style=social&logo=telegram)](https://t.me/wrap_mutant)

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

## Examples

reactflow example [[demo](https://kai3341.github.io/d73bce02-46a1-4e59-895a-4863c2fc48f0/) | [repo](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0)]

- [/src/pages/projects/projects.tsx](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/pages/projects/projects.tsx)
- [/src/lib/statemgr.ts](https://github.com/kai3341/d73bce02-46a1-4e59-895a-4863c2fc48f0/blob/master/src/lib/statemgr.ts)

[pravosleva](https://github.com/pravosleva)'s substring-highlight-sample [[demo](https://kai3341.github.io/substring-highlight-sample/) | [repo](https://github.com/kai3341/substring-highlight-sample)]

- [/src/pages/uremont/reviews/kai3341-sample/Sample.tsx](https://github.com/kai3341/substring-highlight-sample/blob/master/src/pages/uremont/reviews/kai3341-sample/Sample.tsx)

## Subpackages:

[![Just core. Tiny and easy](https://img.shields.io/badge/%40wrap--mutant%2Fcore-blue.svg?style=social&logo=github)](./packages/core/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Fcore?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/core)

[![Utils solve some problems](https://img.shields.io/badge/%40wrap--mutant%2Futils-blue.svg?style=social&logo=github)](./packages/utils/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Futils?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/utils)

[![React integration](https://img.shields.io/badge/%40wrap--mutant%2Freact-blue.svg?style=social&logo=github)](./packages/react/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Freact?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react)

[![React. Rendered Array](https://img.shields.io/badge/%40wrap--mutant%2Freact--rendered--array-blue.svg?style=social&logo=github)](./packages/react-renddered-array/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Freact-rendered-array?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react-renddered-array)
