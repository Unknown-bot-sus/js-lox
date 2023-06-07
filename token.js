module.exports = class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return `${this.type} ${this.lexeme} ${this.literal}`;
    }
  }
};
