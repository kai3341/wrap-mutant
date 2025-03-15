import {
  registerCustomArray,
  RenderedArrayGeneric,
  RenderedArrayOptions,
  AnyArraySubclass,
} from "./base";

registerCustomArray(Array as AnyArraySubclass, {
  pushLike: ["push", "unshift"],
  spliceLike: ["pop", "shift", "reverse", "splice"],
  // sortLike: ["sort"],
});

export const RenderedArray = <T extends {}>(options: RenderedArrayOptions<T>) =>
  RenderedArrayGeneric(Array, options);
