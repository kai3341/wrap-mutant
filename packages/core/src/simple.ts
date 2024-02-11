import { originalTargetSymbol, wrappedMetaSymbol } from "./constants";

export type TargetMixin<T> = {
  [originalTargetSymbol]: HasTarget<T>;
  [wrappedMetaSymbol]: {};
};

export type HasTarget<T> = T & TargetMixin<T>;

export const wrap = /*#__PURE__*/ <T>(target: T, options = {}) => {
  const newTarget = target as HasTarget<T>;
  newTarget[originalTargetSymbol] = newTarget;
  newTarget[wrappedMetaSymbol] = options;
  return new Proxy(newTarget, options);
};

export const rewrap = /*#__PURE__*/ <T>(target: HasTarget<T>) =>
  new Proxy(target[originalTargetSymbol], target[wrappedMetaSymbol]);
