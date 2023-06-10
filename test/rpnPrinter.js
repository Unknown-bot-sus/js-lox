const assert = require("assert");

const RPNPrinter = require("../rpnPrinter");
const { Binary, Unary, Literal, Grouping } = require("../expr");
const tokenType = require("../tokenType");
const Token = require("../token");
const TokenType = require("../tokenType");

describe("RPN Printer", () => {
  let rpnPrinter = new RPNPrinter();
  it("Should print AST in correct order", () => {
    const expression = new Binary(
      new Binary(
        new Literal(1),
        new Token(TokenType.PLUS, "+", null, 1),
        new Literal(2)
      ),
      new Token(TokenType.STAR, "*", null, 1),
      new Binary(
        new Literal(4),
        new Token(TokenType.MINUS, "-", null, 1),
        new Literal(3)
      )
    );

    const translation = rpnPrinter.print(expression);

    assert.strictEqual(translation, "1 2 + 4 3 - *");
  });
});
