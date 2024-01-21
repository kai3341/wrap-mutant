import { extractTargetSymbol, options, HasTarget } from "./constants";

export const wrap = <T>(target: T) => {
  const newTarget = target as T & HasTarget<T>;
  newTarget[extractTargetSymbol] = newTarget;
  return new Proxy(newTarget, options);
}

export const rewrap = <T>(target: T & HasTarget<T>) => new Proxy(target[extractTargetSymbol], options);
