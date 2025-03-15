// @ts-expect-error: 2322
export const originalTargetSymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/core:original-target")
    : Symbol.for("@wrap-mutant/core:original-target");

// @ts-expect-error: 2322
export const wrappedMetaSymbol: unique symbol =
  process.env.NODE_ENV === "production"
    ? Symbol("@wrap-mutant/core:wrapped-metadata")
    : Symbol.for("@wrap-mutant/core:wrapped-metadata");
