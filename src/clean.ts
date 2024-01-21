import { extractTargetSymbol, toggleWrapperSymbol, Surrogate } from "./constants";

export const clean = <T>(target: T & Surrogate<T>) => {
  delete target[toggleWrapperSymbol];
  delete target[extractTargetSymbol];
  return target as T
};
