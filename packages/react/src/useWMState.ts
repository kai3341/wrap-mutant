import { useMemo, useState } from "react";
import { wrap, toggle, bindCallables, HasWrapperGen } from "./externals";

export type WMStateOptions<A, D> = {
  bind?: boolean;
  deps?: D[];
  args?: A;
  count?: number;
};

type UseStateReturning<T> = [
  HasWrapperGen<T>,
  (value: HasWrapperGen<T>) => void,
];

type FactoryFNArgs<A> = A | undefined;
type FactoryFN<A, T> = (args: FactoryFNArgs<A>) => T;

/*#__PURE__*/ function updateWMState<T>(this: UseStateReturning<T>) {
  const [state, setState] = this;
  setState(toggle(state));
}

const WMStateFactory = /*#__PURE__*/ <A, T>(
  factory: FactoryFN<A, T>,
  args: FactoryFNArgs<A>,
  bind: boolean,
  count?: number,
) => {
  const value = factory(args);
  if (bind) bindCallables(value);
  return wrap(value, count);
};

export const useWMState = /*#__PURE__*/ <A, D, T>(
  factory: FactoryFN<A, T>,
  { deps = [], bind = false, args, count }: WMStateOptions<A, D> = {},
) => {
  const value = useMemo(() => WMStateFactory(factory, args, bind, count), deps);

  const stateData = useState(value);
  const [state] = stateData;

  const updateState = useMemo(
    // prettier-ignore
    () => (updateWMState<T>).bind(stateData),
    stateData,
  );

  return [state, updateState] as const;
};
