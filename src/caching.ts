import { extractTargetSymbol, toggleWrapperSymbol, options } from "./constants";

export type WrapperGenMixin<T> = {
  [extractTargetSymbol]: HasWrapperGen<T>;
  [toggleWrapperSymbol]: Generator<HasWrapperGen<T>, never, unknown>;
};

export type HasWrapperGen<T> = T & WrapperGenMixin<T>;

const toggleCachedGenerator = function* <T>(cached: T[]) {
  while (true) for (const current of cached) yield current;
};

export const wrapCached = <T>(target: T, count = 3) => {
  const cached: HasWrapperGen<T>[] = [];
  const newTarget = target as HasWrapperGen<T>;
  for (let i = 0; i < count; i++) cached.push(new Proxy(newTarget, options));
  newTarget[toggleWrapperSymbol] = toggleCachedGenerator(cached);
  newTarget[extractTargetSymbol] = newTarget;
  return cached[count - 1];
};

export const toggleCached = <T>(target: HasWrapperGen<T>) => {
  const gen = target[toggleWrapperSymbol];
  const next = gen.next();
  return next.value;
};
