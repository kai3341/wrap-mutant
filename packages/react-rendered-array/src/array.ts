import {
  registerCustomArray,
  RenderedArrayGeneric,
  RenderedArrayOptions,
} from "./base";

registerCustomArray(Array, {
  pushLike: ["push", "unshift"],
  spliceLike: ["pop", "shift", "reverse", "splice"],
  sortLike: ["sort"],
});

export const RenderedArray = <T extends {}>(options: RenderedArrayOptions<T>) =>
  RenderedArrayGeneric(Array, options);
