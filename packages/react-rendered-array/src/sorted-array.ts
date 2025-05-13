import SortedArray from "sorted-array-type";

import {
  registerCustomArray,
  RenderedArrayGeneric,
  RenderedArrayOptions,
  AnyArraySubclass,
  RA,
} from "./base";

import { renderedArraySymbol } from "./constants";

registerCustomArray(SortedArray as AnyArraySubclass, {
  pushLike: ["push", "unshift"],
  spliceLike: ["pop", "shift", "reverse", "splice"],
  // sortLike: ["sort"],
});

type RenderedSortedArrayOptions<T> = RenderedArrayOptions<T> & {
  compareFunc: (a: T, b: T) => number;
  equalityFunc: (a: T, b: T) => unknown;
};

export const RenderedSortedArray = <T extends {}>(
  options: RenderedSortedArrayOptions<T>,
) => {
  const rendered = RenderedArrayGeneric(SortedArray, options) as RA<
    T,
    SortedArray<T>
  >;
  const inner = rendered[renderedArraySymbol];
  rendered.compareFunc = options.compareFunc;
  rendered.equalityFunc = options.equalityFunc;
  return rendered;
};
