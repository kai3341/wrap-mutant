import { createContext, useMemo } from "react";
import type { ProviderProps, Provider, Context } from "react";

function MutableProvider<T extends {}>(
  this: Provider<T>,
  { value, children }: ProviderProps<T>,
) {
  const DefaultProvider = this;
  const memoValue = useMemo(() => value, []);
  Object.assign(memoValue, value);
  return <DefaultProvider value={memoValue}>{children}</DefaultProvider>;
}

export function createMutableContext<T extends {}>(defaultValue: T) {
  const ctx = createContext(defaultValue);
  // @ts-expect-error:2352, 2769
  ctx.Provider = MutableProvider.bind(ctx.Provider);
  return ctx as Context<T>;
}
