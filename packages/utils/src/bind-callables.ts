export const bindCallables = <T extends {}>(target: T) => {
  const newProps: PropertyDescriptorMap = {};
  const descriptors = Object.getOwnPropertyDescriptors(
    target.constructor.prototype,
  );

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === "constructor") continue;
    const { value } = descriptor;
    if (typeof value === "function") {
      descriptor.value = value.bind(target);
      newProps[key] = descriptor;
    }
  }

  return Object.defineProperties(target, newProps);
};
