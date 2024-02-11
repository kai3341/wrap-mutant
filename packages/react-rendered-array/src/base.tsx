import { wrap as _wrap, toggle, bindCallables } from "@wrap-mutant/react";

import {
  changedFlagSymbol,
  renderedArraySymbol,
  componentSymbol,
  keyFNSymbol,
} from "./constants";

import type { FC } from "react";
import type { HasWrapperGen } from "@wrap-mutant/react";

export type KeyFN<T> = (item: T) => string | number;

export type RenderedMixin<T> = {
  [changedFlagSymbol]: boolean;
  [renderedArraySymbol]: HasWrapperGen<Array<JSX.Element>>;
  [componentSymbol]: FC<T>;
  [keyFNSymbol]: KeyFN<T>;
  render: () => HasWrapperGen<Array<JSX.Element | undefined>>;
};

export type RenderedArrayType<T> = RenderedMixin<T> & Array<T>;

const numeric = /\d+/;

export const RenderedArrayHandler = {
  set<T extends {}>(
    target: RenderedArrayType<T>,
    property: keyof RenderedArrayType<T>,
    value: T,
    receiver: any,
  ) {
    if (typeof property === "string" && property.match(numeric)) {
      const Component = target[componentSymbol];
      const inner = target[renderedArraySymbol];
      const keyFN = target[keyFNSymbol];
      // @ts-expect-error: 2540
      inner[property] = <Component {...value} key={keyFN(value)} />;
      target[changedFlagSymbol] = true;
    }
    // @ts-expect-error: 2540
    target[property] = value;
    return true;
  },
  deleteProperty<T extends {}>(
    target: RenderedArrayType<T>,
    property: keyof RenderedArrayType<T>,
  ) {
    if (typeof property === "string" && property.match(numeric)) {
      const inner = target[renderedArraySymbol];
      // @ts-expect-error: 2540
      delete inner[property];
      target[changedFlagSymbol] = true;
    }
    delete target[property];
    return true;
  },
};

const methodCreators = {
  pushLike<T>(
    Base: ArrayConstructor,
    property: Exclude<keyof Array<T>, number>,
  ) {
    const Super = Base.prototype[property];
    return function <T>(this: RenderedArrayType<T>, ...items: T[]) {
      const Component = this[componentSymbol];
      const inner = this[renderedArraySymbol];
      const keyFN = this[keyFNSymbol];

      try {
        for (const props of items) {
          // @ts-expect-error: 2349
          Super.call(inner, <Component {...props} key={keyFN(props)} />);
          // inner[property](<Component {...props} key={keyFN(props)} />);
          // @ts-expect-error: 2349
          Super.call(this, props);
          // this[property](props);
        }

        return this.length;
      } finally {
        this[changedFlagSymbol] = true;
      }
    };
  },

  spliceLike<T>(
    Base: ArrayConstructor,
    property: Exclude<keyof Array<T>, number>,
  ) {
    const Super = Base.prototype[property];
    return function <T>(this: RenderedArrayType<T>, ...args: any[]) {
      const inner = this[renderedArraySymbol];

      try {
        // @ts-expect-error: 2349
        Super.apply(inner, args);
        // @ts-expect-error: 2349
        return Super.apply(this, args);
      } finally {
        this[changedFlagSymbol] = true;
      }
    };
  },

  sortLike<T>(
    Base: ArrayConstructor,
    property: Exclude<keyof Array<T>, number>,
  ) {
    const Super = Base.prototype[property];
    return function <T>(
      this: RenderedArrayType<T>,
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

  deprecated<T, A, R>(
    Base: ArrayConstructor,
    property: Exclude<keyof Array<T>, number | symbol>,
  ) {
    const Super = Base.prototype[property] as (...args: A[]) => R;
    const deprecationMSG = `Method "${property}" is deprecated. Aviod ist usage`;
    return function <T>(this: RenderedArrayType<T>, ...args: A[]) {
      console.warn(deprecationMSG);
      return Super.apply(this, args) as R;
    };
  },
};

function render<T>(this: RenderedArrayType<T>) {
  let rendered = this[renderedArraySymbol];

  if (this[changedFlagSymbol]) {
    rendered = toggle(rendered);
    this[renderedArraySymbol] = rendered;
    this[changedFlagSymbol] = false;
  }

  return rendered;
}

const customArrayClasses = new Map<ArrayConstructor, any>();

interface RegisterCustomArrayOptions {
  [key: string]: string[];
}

export function registerCustomArray(
  Base: ArrayConstructor,
  options: RegisterCustomArrayOptions,
) {
  const NewBase = class extends Base {};

  const toAssign = { render };

  for (const [name, values] of Object.entries(options)) {
    for (const value of values) {
      const key = name as keyof typeof methodCreators;
      const creator = methodCreators[key];
      // @ts-expect-error: 7053
      toAssign[value] = creator(Base, value);
    }
  }

  Object.assign(NewBase.prototype, toAssign);

  // const factory = () => {
  //   const A = new Base();
  //   Object.assign(A, toAssign);
  //   return A;
  // };

  customArrayClasses.set(Base, NewBase);
}

export type RenderedArrayOptions<T> = {
  Component: FC<T>;
  keyFunction: KeyFN<T>;
  count?: number;
};

export function RenderedArrayGeneric<T extends {}>(
  Base: ArrayConstructor,
  { Component, keyFunction, count }: RenderedArrayOptions<T>,
) {
  const CustomType = customArrayClasses.get(Base) as ArrayConstructor;
  let renderedArray = new CustomType<T>() as RenderedArrayType<T>;
  renderedArray[changedFlagSymbol] = false;
  renderedArray[renderedArraySymbol] = _wrap(
    bindCallables(new Base() as JSX.Element[]),
  );
  renderedArray[componentSymbol] = Component;
  renderedArray[keyFNSymbol] = keyFunction;
  renderedArray = _wrap(
    bindCallables(renderedArray),
    count,
    RenderedArrayHandler,
  );
  return renderedArray;
}
