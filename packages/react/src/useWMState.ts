import { useMemo, useState, useCallback } from "react";
import { wrapCached, toggleCached, HasWrapperGen } from "@wrap-mutant/core";
import { bindCallables } from "@wrap-mutant/utils";

export type WMStateOptions<A> = {
  bind?: boolean;
  deps?: any[];
  args?: A;
  count?: number;
};

const WMStateFactory = <A, T>(
  factory: (args: A) => T,
  args: A,
  bind: boolean,
  count?: number,
) => {
  const value = factory(args);
  if (bind) bindCallables(value);
  return wrapCached(value, count);
};

export const useWMState = <A, T>(
  factory: () => T,
  { deps = [], bind = false, args, count }: WMStateOptions<A> = {},
) => {
  const wrappedValue = useMemo(
    () => WMStateFactory(factory, args, bind, count),
    deps,
  );
  const [state, setState] = useState(wrappedValue);

  const updateState = useCallback(
    (value: HasWrapperGen<T>) => setState(toggleCached(value)),
    [setState],
  );

  return [state, updateState] as const;
};
