import { createElement } from "react";

import { wrap as _wrap, toggle, bindCallables } from "@wrap-mutant/react";
import { unwrap } from "@wrap-mutant/core";

import {
  changedFlagSymbol,
  renderedArraySymbol,
  componentSymbol,
  keyFNSymbol,
} from "./constants";

import type { FC, JSX } from "react";
import type { HasWrapperGen } from "@wrap-mutant/react";

export type ArraySubclass<T, C extends typeof Array<T>> = new () => C;
export type AnyArraySubclass = ArraySubclass<any, any>;

export type KeyFN<T> = (item: T) => string | number;

export type RMixin<T extends {}> = {
  [changedFlagSymbol]: boolean;
  [renderedArraySymbol]: HasWrapperGen<Array<JSX.Element | undefined>>;
  [componentSymbol]: FC<T>;
  [keyFNSymbol]: KeyFN<T>;
  render: () => HasWrapperGen<Array<JSX.Element | undefined>>;
};

export type RAType<T extends {}, C extends typeof Array<T>> = RMixin<T> & C;
export type RA<T extends {}, C extends Array<T>> = RMixin<T> & C;

const numeric = /\d+/;

export const RenderedArrayHandler = {
  set<T extends {}, C extends Array<T>, A extends RA<T, C>>(
    target: A,
    property: keyof A,
    value: T,
    _receiver: any,
  ) {
    if (typeof property === "string" && property.match(numeric)) {
      const Component = target[componentSymbol];
      const inner = target[renderedArraySymbol];
      const keyFN = target[keyFNSymbol];
      inner[property as any as number] = createElement(Component, {
        ...value,
        key: keyFN(value),
      });
      target[changedFlagSymbol] = true;
    }

    target[property as any as number] = value;
    return true;
  },
  deleteProperty<T extends {}, C extends Array<T>, A extends RA<T, C>>(
    target: A,
    property: keyof A,
  ) {
    if (typeof property === "string" && property.match(numeric)) {
      const inner = target[renderedArraySymbol];
      delete inner[property as any as number];
      target[changedFlagSymbol] = true;
    }
    delete target[property];
    return true;
  },
};

const methodCreators = {
  pushLike<T extends {}, C extends typeof Array<T>>(
    Base: new () => C,
    property: Exclude<keyof Array<T>, number | symbol>,
  ) {
    const SuperFN = Base.prototype[property] as Function;

    return function (this: RAType<T, C>, ...items: T[]) {
      const Component = this[componentSymbol];
      const inner = unwrap(this[renderedArraySymbol]);
      const keyFN = this[keyFNSymbol];

      const components = items.map((props) =>
        createElement(Component, { ...props, key: keyFN(props) }),
      );

      try {
        SuperFN.apply(inner, components);
        return SuperFN.apply(this, items);
      } finally {
        this[changedFlagSymbol] = true;
      }
    };
  },

  spliceLike<T extends {}, C extends typeof Array<T>>(
    Base: new () => C,
    property: Exclude<keyof Array<T>, number | symbol>,
  ) {
    const SuperFN = Base.prototype[property] as Function;

    return function (this: RAType<T, C>, ...args: any[]) {
      const inner = unwrap(this[renderedArraySymbol]);

      try {
        SuperFN.apply(inner, args);
        return SuperFN.apply(this, args);
      } finally {
        this[changedFlagSymbol] = true;
      }
    };
  },

  /*
  findLike<T extends {}, C extends typeof Array<T>>(
    Base: new () => C,
    property: Exclude<keyof Array<T>, number | symbol>,
  ) {
    const SuperFN = Base.prototype[property] as Function;
    const Super = SuperFN.apply;

    return function <T>(
      this: RAType<T>,
      callback: (item: T) => any,
    ) {
      const inner = this[renderedArraySymbol];

      try {
        // @ts-expect-error: 2349
        Super.call(inner, (rendered: JSX.Element) => callback(rendered.props));
        // @ts-expect-error: 2349
        return Super.call(this, callback);
      } finally {
        this[changedFlagSymbol] = true;
      }
    };
  },
  */

  deprecated<T extends {}, C extends typeof Array<T>, A, R>(
    Base: new () => C,
    property: Exclude<keyof Array<T>, number | symbol>,
  ) {
    const SuperFN = Base.prototype[property] as (...args: A[]) => R;
    const deprecationMSG = `Method "${property}" is deprecated. Aviod ist usage`;
    return function (this: RAType<T, C>, ...args: A[]) {
      console.warn(deprecationMSG);
      return SuperFN.apply(this, args) as R;
    };
  },
};

function render<T extends {}, C extends typeof Array<T>>(this: RAType<T, C>) {
  let rendered = this[renderedArraySymbol];

  if (this[changedFlagSymbol]) {
    rendered = toggle(rendered);
    this[renderedArraySymbol] = rendered;
    this[changedFlagSymbol] = false;
  }

  return rendered;
}

const customArrayClasses = new Map<AnyArraySubclass, AnyArraySubclass>();

export function registerCustomArray<T, C extends typeof Array<T>>(
  Base: ArraySubclass<T, C>,
  options: Record<string, string[]>,
) {
  const NewBase = class extends Base {};

  const toAssign = { render };

  for (const [name, values] of Object.entries(options)) {
    for (const value of values) {
      const key = name as keyof typeof methodCreators;
      const creator = methodCreators[key];
      // @ts-expect-error: 2349,7053
      toAssign[value] = creator(Base, value);
    }
  }

  Object.assign(NewBase.prototype, toAssign);
  customArrayClasses.set(Base, NewBase);
}

export type RenderedArrayOptions<T> = {
  Component: FC<T>;
  keyFunction: KeyFN<T>;
  count?: number;
};

export function RenderedArrayGeneric<T extends {}, C extends Array<T>>(
  Base: new () => C,
  { Component, keyFunction, count }: RenderedArrayOptions<T>,
) {
  const CustomType = customArrayClasses.get(Base) as RAType<T, typeof Array>;
  let renderedArray = new CustomType() as RA<T, C>;
  renderedArray[changedFlagSymbol] = false;
  // @ts-expect-error: 2352
  const rendered = bindCallables(new Base() as JSX.Element[]);
  renderedArray[renderedArraySymbol] = _wrap(rendered, count);
  renderedArray[componentSymbol] = Component;
  renderedArray[keyFNSymbol] = keyFunction;
  renderedArray = bindCallables(renderedArray);
  renderedArray = _wrap(
    renderedArray,
    count,
    RenderedArrayHandler as ProxyHandler<RA<T, C>>,
  );
  return renderedArray;
}
