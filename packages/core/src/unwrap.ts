import { originalTargetSymbol } from "./constants";

import type { HasTarget } from "./simple";
import type { HasWrapperGen } from "./caching";

export const unwrap = /*#__PURE__*/ <T>(
  target: HasTarget<T> | HasWrapperGen<T>,
) => target[originalTargetSymbol];
