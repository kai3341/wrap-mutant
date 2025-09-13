import { originalTargetSymbol, wrappedMetaSymbol } from "./constants";

export type WrapperGenMixin<T extends {}> = {
  [originalTargetSymbol]: HasWrapperGen<T>;
  [wrappedMetaSymbol]: () => HasWrapperGen<T>;
};

export type HasWrapperGen<T extends {}> = T & WrapperGenMixin<T>;

type LLNode<T> = {
  value: T;
  next: LLNode<T>;
};

type LLHead<T> = {
  head: LLNode<T>;
};

const toggleCachedGenerator = <T extends {}>(head: LLHead<T>) => {
  return () => {
    const { next, value } = head.head;
    head.head = next;
    return value;
  };
};

export const wrapCached = <T extends {}>(
  target: T,
  count = 3,
  options: ProxyHandler<T> = {},
) => {
  const newTarget = target as HasWrapperGen<T>;
  let value = new Proxy(newTarget, options);
  const last = { value } as LLNode<HasWrapperGen<T>>;
  let next = last;
  for (let i = 1; i < count; i++) {
    value = new Proxy(newTarget, options);
    next = { value, next } as LLNode<HasWrapperGen<T>>;
  }
  last.next = next;
  const head = { head: next } as LLHead<HasWrapperGen<T>>;
  newTarget[originalTargetSymbol] = newTarget;
  newTarget[wrappedMetaSymbol] = toggleCachedGenerator(head);
  return last.value;
};

export const toggleCached = <T extends {}>(target: HasWrapperGen<T>) =>
  target[wrappedMetaSymbol]();
