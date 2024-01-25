import { useState, useCallback } from "react";
import { toggleCached, HasWrapperGen } from "@wrap-mutant/core";

export const useWMState = <T>(initialState: HasWrapperGen<T>) => {
  const [state, setState] = useState(initialState);

  const updateState = useCallback(
    (value: HasWrapperGen<T>) => setState(toggleCached(value)),
    [setState],
  );

  return [state, updateState] as const;
};
