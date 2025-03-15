import { originalTargetSymbol } from "./constants";

import type { HasTarget } from "./simple";
import type { HasWrapperGen } from "./caching";

export const unwrap = <T extends {}>(target: HasTarget<T> | HasWrapperGen<T>) =>
  target[originalTargetSymbol];
