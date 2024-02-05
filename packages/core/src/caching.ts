import { extractTargetSymbol, toggleWrapperSymbol } from "./constants";

export type WrapperGenMixin<T> = {
  [extractTargetSymbol]: HasWrapperGen<T>;
  [toggleWrapperSymbol]: () => HasWrapperGen<T>;
};

export type HasWrapperGen<T> = T & WrapperGenMixin<T>;

// Initially it was generator, but ES5 generator polyfill is too large
const toggleCachedGenerator = /*#__PURE__*/ <T>(cached: T[]) => {
  return () => {
    const next = cached.shift() as T;
    cached.push(next);
    return next;
  };
};

export const wrapCached = /*#__PURE__*/ <T>(
  target: T,
  count = 3,
  options = {},
) => {
  const cached: HasWrapperGen<T>[] = [];
  const newTarget = target as HasWrapperGen<T>;
  for (let i = 0; i < count; i++) cached.push(new Proxy(newTarget, options));
  newTarget[toggleWrapperSymbol] = toggleCachedGenerator(cached);
  newTarget[extractTargetSymbol] = newTarget;
  return cached[count - 1];
};

export const toggleCached = /*#__PURE__*/ <T>(target: HasWrapperGen<T>) =>
  target[toggleWrapperSymbol]();
