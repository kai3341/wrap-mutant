const descriptorKeys: ("get" | "set" | "value")[] = ["value", "get", "set"];

export const bindCallables = <T extends {}>(target: T) => {
  const newProps: PropertyDescriptorMap = {};
  const descriptors = Object.getOwnPropertyDescriptors(
    target.constructor.prototype,
  );

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === "constructor") continue;

    for (const dKey of descriptorKeys) {
      const dVal = descriptor[dKey];
      if (typeof dVal === "function") {
        descriptor[dKey] = dVal.bind(target);
        newProps[key] = descriptor;
      }
    }
  }

  return Object.defineProperties(target, newProps);
};
