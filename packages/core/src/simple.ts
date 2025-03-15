import { originalTargetSymbol, wrappedMetaSymbol } from "./constants";

export type TargetMixin<T extends {}> = {
  [originalTargetSymbol]: HasTarget<T>;
  [wrappedMetaSymbol]: ProxyHandler<T>;
};

export type HasTarget<T extends {}> = T & TargetMixin<T>;

export const wrap = <T extends {}>(
  target: T,
  options: ProxyHandler<T> = {},
) => {
  const newTarget = target as HasTarget<T>;
  newTarget[originalTargetSymbol] = newTarget;
  newTarget[wrappedMetaSymbol] = options;
  return new Proxy(newTarget, options);
};

export const rewrap = <T extends {}>(target: HasTarget<T>) =>
  new Proxy(target[originalTargetSymbol], target[wrappedMetaSymbol]);
