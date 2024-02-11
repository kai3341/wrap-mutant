import { originalTargetSymbol, wrappedMetaSymbol } from "./constants";

export type HasBothMixin<T> = {
  [originalTargetSymbol]?: HasBoth<T>;
  [wrappedMetaSymbol]?: any;
};

export type HasBoth<T> = T & HasBothMixin<T>;

export const clean = /*#__PURE__*/ <T>(target: HasBoth<T>) => {
  delete target[wrappedMetaSymbol];
  delete target[originalTargetSymbol];
  return target as T;
};
