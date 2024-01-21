import { extractTargetSymbol, HasTarget, HasWrapperGen } from "./constants";

export const unwrap = <T>(target: T & (HasTarget<T> | HasWrapperGen<T>)) => target[extractTargetSymbol];
