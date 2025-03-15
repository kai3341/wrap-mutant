// @ts-expect-error: 2322
export const changedFlagSymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/react-rendered-array:changed-flag")
    : Symbol.for("@wrap-mutant/react-rendered-array:changed-flag");

// @ts-expect-error: 2322
export const renderedArraySymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/react-rendered-array:rendered-array")
    : Symbol.for("@wrap-mutant/react-rendered-array:rendered-array");

// @ts-expect-error: 2322
export const componentSymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/react-rendered-array:component")
    : Symbol.for("@wrap-mutant/react-rendered-array:component");

// @ts-expect-error: 2322
export const keyFNSymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/react-rendered-array:key-function")
    : Symbol.for("@wrap-mutant/react-rendered-array:key-function");
