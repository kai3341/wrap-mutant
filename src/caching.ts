import { extractTargetSymbol, toggleWrapperSymbol, options, HasWrapperGen } from "./constants";


const toggleCachedGenerator = function*<T>(cached: T[]) {
  while(true) for (const current of cached) yield current;
};


export const wrapCached = <T>(target: T, count = 3) => {
  const cached: (T & HasWrapperGen<T>)[] = [];
  const newTarget = target as T & HasWrapperGen<T>
  for (let i=0; i<count; i++) cached.push(new Proxy(newTarget, options));
  newTarget[toggleWrapperSymbol] = toggleCachedGenerator(cached);
  newTarget[extractTargetSymbol] = newTarget;
  return cached[0];
};


export const toggleCached = <T>(target: T & HasWrapperGen<T>) => {
  const gen = target[toggleWrapperSymbol];
  const next = gen.next();
  return next.value;
};
