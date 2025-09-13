import { jsx } from "react/jsx-runtime";
import { createContext, useMemo } from "react";
import type { ProviderProps, Provider, Context } from "react";

function MutableProvider<T extends {}>(
  this: Provider<T>,
  { value: _value, children }: ProviderProps<T>,
) {
  const DefaultProvider = this;
  const value = useMemo(() => _value, []);
  Object.assign(value, _value);
  return jsx(DefaultProvider, { value, children });
}

export function createMutableContext<T extends {}>(defaultValue: T) {
  const ctx = createContext(defaultValue);
  // @ts-expect-error:2352, 2769
  ctx.Provider = MutableProvider.bind(ctx.Provider);
  return ctx as Context<T>;
}
