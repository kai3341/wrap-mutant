import { extractTargetSymbol } from "./constants";

import type { HasTarget } from "./simple";
import type { HasWrapperGen } from "./caching";

export const unwrap = <T>(target: HasTarget<T> | HasWrapperGen<T>) =>
  target[extractTargetSymbol];
