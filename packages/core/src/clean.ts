import { extractTargetSymbol, toggleWrapperSymbol } from "./constants";

export type HasBothMixin<T> = {
  [extractTargetSymbol]?: HasBoth<T>;
  [toggleWrapperSymbol]?: Generator<HasBoth<T>, never, unknown>;
};

export type HasBoth<T> = T & HasBothMixin<T>;

export const clean = /*#__PURE__*/ <T>(target: HasBoth<T>) => {
  delete target[toggleWrapperSymbol];
  delete target[extractTargetSymbol];
  return target as T;
};
