import { useMemo, useState, useCallback } from "react";
import { wrapCached, toggleCached, HasWrapperGen } from "@wrap-mutant/core";
import { bindCallables } from "@wrap-mutant/utils";

export type WMStateOptions<A> = {
  bind?: boolean;
  deps?: any[];
  args?: A;
};

const WMStateFactory = <A, T>(
  factory: (args: A) => T,
  args: A,
  bind: boolean,
) => {
  const value = factory(args);
  if (bind) bindCallables(value);
  return wrapCached(value);
};

export const useWMState = <A, T>(
  factory: () => T,
  { deps = [], bind = false, args }: WMStateOptions<A> = {},
) => {
  const wrappedValue = useMemo(() => WMStateFactory(factory, args, bind), deps);
  const [state, setState] = useState(wrappedValue);

  const updateState = useCallback(
    (value: HasWrapperGen<T>) => setState(toggleCached(value)),
    [setState],
  );

  return [state, updateState] as const;
};
