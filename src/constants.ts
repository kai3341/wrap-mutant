export const extractTargetSymbol = Symbol();
export const toggleWrapperSymbol = Symbol();
export const options = {};

export type HasTarget<T> = {
  [extractTargetSymbol]: T & HasTarget<T>,
};

export type HasWrapperGen<T> = {
  [extractTargetSymbol]: T & HasWrapperGen<T>,
  [toggleWrapperSymbol]: Generator<T & HasWrapperGen<T>, never, unknown>,
};

export type Surrogate<T> = {
  [extractTargetSymbol]?: T & Surrogate<T>,
  [toggleWrapperSymbol]?: Generator<T & Surrogate<T>, never, unknown>,
};
