const assert = require("assert");

const AstPrinter = require("../astPrinter");
const { Binary, Unary, Literal, Grouping } = require("../expr");
const tokenType = require("../tokenType");
const Token = require("../token");
const TokenType = require("../tokenType");

describe("AST Printer", () => {
  let astPrinter = new AstPrinter();
  it("Should print AST in correct order", () => {
    const expression = new Binary(
      new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
      new Token(TokenType.STAR, "*", null, 1),
      new Grouping(new Literal(45.67))
    );

    const translation = astPrinter.print(expression);

    assert.strictEqual(translation, "(* (- 123) (group 45.67))");
  });
});
