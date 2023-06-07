exports.constructEnum = (array) => {
  const enumTypes = {};

  for (let key of array) {
    enumTypes[key] = Symbol(key);
  }

  return enumTypes;
};
