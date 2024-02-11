import { useMemo, useState } from "react";
import {
  wrap as wrap_,
  toggle,
  bindCallables,
  HasWrapperGen,
} from "./externals";

import {
  wrappedMetaSymbol,
  originalTargetSymbol,
} from "@wrap-mutant/core/constants";

export type WMStateOptions<A, D> = {
  bind?: boolean;
  wrap?: boolean;
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

// Asking webpack to remove it
let raised: /*#__PURE__*/ Set<any>;
let handler: /*#__PURE__*/ {
  get: <T>(target: T, prop: string | symbol) => any;
};

if (process.env.NODE_ENV !== "production") {
  raised = new Set();
  handler = {
    get: <T>(target: T, prop: string | symbol) => {
      // @ts-expect-error: 7053
      const val = target[prop];
      if (
        typeof prop === "string" &&
        typeof val === "function" &&
        prop !== "constructor" &&
        !val.name.startsWith("bound ") &&
        !raised.has(val)
      ) {
        raised.add(val);
        const error = new Error(
          [
            `You are trying to call the method \`${prop}\` which looks unbound.`,
            "Did you forget option `{bind: true}`?",
            "This code will not work on the production.",
          ].join(" "),
        );
        console.error(error);
        return val.bind(target);
      }
      return val;
    },
  };
}

/*#__PURE__*/ function updateWMState<T extends {}>(this: UseStateReturning<T>) {
  const [state, setState] = this;
  setState(toggle(state));
}

const WMStateFactory = /*#__PURE__*/ <A, T extends {}>(
  factory: FactoryFN<A, T>,
  args: FactoryFNArgs<A>,
  bind: boolean,
  wrap: boolean,
  count?: number,
) => {
  let value = factory(args);
  if (bind) {
    if (process.env.NODE_ENV !== "production") {
      if (wrappedMetaSymbol in value || originalTargetSymbol in value) {
        raised.add(value);
        const error = new Error(
          [
            "You have set option `{bind: true}` on already wrapped object.",
            "It looks like an error",
          ].join(" "),
        );
        console.error(error);
      }
    }
    value = bindCallables(value);
  } else if (process.env.NODE_ENV !== "production") {
    if (
      wrap &&
      !(wrappedMetaSymbol in value) &&
      !(originalTargetSymbol in value)
    ) {
      value = new Proxy(value, handler) as T;
    }
  }

  if (wrap) {
    if (process.env.NODE_ENV !== "production") {
      if (wrappedMetaSymbol in value || originalTargetSymbol in value) {
        if (!raised.has(value)) {
          raised.add(value);
          const error = new Error(
            [
              "Target looks already wrapped.",
              "Did you forget option `{wrap: false}`?",
            ].join(" "),
          );
          console.error(error);
        }
      }
    }

    value = wrap_(value, count);
  }

  return value as HasWrapperGen<T>;
};

export const useWMState = /*#__PURE__*/ <A, D, T extends {}>(
  factory: FactoryFN<A, T>,
  {
    deps = [],
    bind = false,
    wrap = true,
    args,
    count,
  }: WMStateOptions<A, D> = {},
) => {
  const value = useMemo(
    () => WMStateFactory(factory, args, bind, wrap, count),
    deps,
  );

  const stateData = useState(value);
  const [state] = stateData;

  const updateState = useMemo(
    // prettier-ignore
    () => (updateWMState<T>).bind(stateData),
    stateData,
  );

  return [state, updateState] as const;
};
