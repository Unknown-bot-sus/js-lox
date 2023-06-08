class Enum {
  constructor(array) {
    for (let key of array) {
      this[key] = Symbol(key);
    }
  }
}

module.exports = Enum;
