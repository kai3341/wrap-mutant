import { useMemo, useState, useCallback } from "react";
import { wrapCached, toggleCached, HasWrapperGen } from "@wrap-mutant/core";
import { bindCallables } from "@wrap-mutant/utils";

export type WMStateOptions = {
  bind?: boolean;
  deps?: any[];
};

const WMStateFactory = <T>(factory: () => T, bind: boolean) => {
  const value = factory();
  if (bind) bindCallables(value);
  return wrapCached(value);
};

export const useWMState = <T>(
  factory: () => T,
  { deps = [], bind = false }: WMStateOptions = {},
) => {
  const wrappedValue = useMemo(() => WMStateFactory(factory, bind), deps);
  const [state, setState] = useState(wrappedValue);

  const updateState = useCallback(
    (value: HasWrapperGen<T>) => setState(toggleCached(value)),
    [setState],
  );

  return [state, updateState] as const;
};
