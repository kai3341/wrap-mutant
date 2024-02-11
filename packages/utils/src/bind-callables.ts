export const bindCallables = /*#__PURE__*/ <T extends {}>(target: T) => {
  const newTarget = target as any;
  const descriptors = Object.getOwnPropertyDescriptors(
    newTarget.constructor.prototype,
  );
  for (const [key, descriptor] of Object.entries(descriptors)) {
    const { value } = descriptor;
    if (typeof value === "function") newTarget[key] = value.bind(newTarget);
  }

  return target;
};
