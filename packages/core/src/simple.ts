import { extractTargetSymbol, options } from "./constants";

export type TargetMixin<T> = {
  [extractTargetSymbol]: HasTarget<T>;
};

export type HasTarget<T> = T & TargetMixin<T>;

export const wrap = /*#__PURE__*/ <T>(target: T) => {
  const newTarget = target as HasTarget<T>;
  newTarget[extractTargetSymbol] = newTarget;
  return new Proxy(newTarget, options);
};

export const rewrap = /*#__PURE__*/ <T>(target: HasTarget<T>) =>
  new Proxy(target[extractTargetSymbol], options);
