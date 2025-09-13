import { originalTargetSymbol, wrappedMetaSymbol } from "./constants";

export type HasBothMixin<T extends {}> = {
  [originalTargetSymbol]?: HasBoth<T>;
  [wrappedMetaSymbol]?: any;
};

export type HasBoth<T extends {}> = T & HasBothMixin<T>;

export const clean = <T extends {}>(target: HasBoth<T>) => {
  delete target[wrappedMetaSymbol];
  delete target[originalTargetSymbol];
  return target as T;
};
