# Wrap mutant [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=social&logo=github)](https://github.com/kai3341/wrap-mutant/blob/main/LICENSE)

Object mutation is easy and extremelly fast. But such libraries like react make us to rebuild objects on every their change. It's not a problem on simple and small objects. When your object is a big array, your application become slow. When you are trying to handle complicated deeply nested object, it becomes a brain cancer.

Solution is in wrapping that big or complex objects into [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object.

> // TODO: create an example application aimed to explain how to use this library and benchmarking

This is a root package. Subpackages:

[![Just core. Tiny and easy](https://img.shields.io/badge/%40wrap--mutant%2Fcore-blue.svg?style=social&logo=github)](./packages/core/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Fcore?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/core)

[![Utils solve some problems](https://img.shields.io/badge/%40wrap--mutant%2Futils-blue.svg?style=social&logo=github)](./packages/utils/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Futils?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/utils)

[![React integration](https://img.shields.io/badge/%40wrap--mutant%2Freact-blue.svg?style=social&logo=github)](./packages/react/)
[![NPM Version](https://img.shields.io/npm/v/%40wrap-mutant%2Freact?style=social&logo=npm)](https://www.npmjs.com/package/@wrap-mutant/react)
