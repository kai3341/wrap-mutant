import { useMemo, useState, useCallback } from "react";
import { wrap, toggle, HasWrapperGen, bindCallables } from "./externals";

export type WMStateOptions<A> = {
  bind?: boolean;
  deps?: any[];
  args?: A;
  count?: number;
};

const WMStateFactory = <A, T>(
  factory: (args: A | undefined) => T,
  args: A | undefined,
  bind: boolean,
  count?: number,
) => {
  const value = factory(args);
  if (bind) bindCallables(value);
  return wrap(value, count);
};

export const useWMState = <A, T>(
  factory: (args: A | undefined) => T,
  { deps = [], bind = false, args, count }: WMStateOptions<A> = {},
) => {
  const wrappedValue = useMemo(
    () => WMStateFactory(factory, args, bind, count),
    deps,
  );
  const [state, setState] = useState(wrappedValue);

  const updateState = useCallback(
    (value: HasWrapperGen<T>) => setState(toggle(value)),
    [setState],
  );

  return [state, updateState] as const;
};
