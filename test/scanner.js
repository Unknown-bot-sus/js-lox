const { readFile } = require("fs/promises");
const assert = require("assert");

const Scanner = require("../scanner");
const TokenType = require("../tokenType");

async function readSource(filePath) {
  const pathToAssets = "./test/assets/scanner/";

  return await readFile(pathToAssets + filePath, "utf-8");
}

async function createScanner(filePath) {
  const source = await readSource(filePath);
  const scanner = new Scanner(source);
  return scanner;
}

describe("Scanner", () => {
  describe("#Strings", () => {
    let scanner;
    before(async () => {
      const filePath = "strings.lox";
      scanner = await createScanner(filePath);
      scanner.scanTokens();
    });

    it(`should recognize '' as string`, () => {
      const { type } = scanner.tokens[0];

      assert.strictEqual(TokenType.STRING, type);
    });
    it(`should recognize "" as string`, () => {
      const { type } = scanner.tokens[0];

      assert.strictEqual(TokenType.STRING, type);
    });
  });

  describe("#Numbers", () => {
    let scanner;
    before(async () => {
      scanner = await createScanner("numbers.lox");
      scanner.scanTokens();
    });

    it("should recognize numbers as number token", () => {
      const { type } = scanner.tokens[0];
      assert.strictEqual(type, TokenType.NUMBER);
    });

    it("should recognize number token literal as number in js", () => {
      const { literal } = scanner.tokens[0];
      assert.strictEqual(typeof literal, "number");
      assert.strictEqual(literal, 2);
    });

    it("should store number lexeme as string", () => {
      const { lexeme } = scanner.tokens[0];
      assert.strictEqual(typeof lexeme, "string");
      assert.strictEqual(lexeme, "2");
    });

    it("should recognize decimal numbers as number token", () => {
      const { type } = scanner.tokens[1];
      assert.strictEqual(type, TokenType.NUMBER);
    });

    it("should recognize decimal number token literal as number in js", () => {
      const { literal } = scanner.tokens[1];
      assert.strictEqual(typeof literal, "number");
      assert.strictEqual(literal, 2.1);
    });

    it("should store decimal number lexeme as string", () => {
      const { lexeme } = scanner.tokens[1];
      assert.strictEqual(typeof lexeme, "string");
      assert.strictEqual(lexeme, "2.1");
    });

    // it("should not store numbers with leading .", () => {
    //   const token = scanner.tokens[2];
    //   assert.strictEqual(undefined, token);
    // });

    // it("should not store numbers with .", () => {
    //   const token = scanner.tokens[3];
    //   assert.strictEqual(undefined, token);
    // });
  });

  describe("#Comments", () => {
    let scanner;
    before(async () => {
      scanner = await createScanner("comments.lox");
      scanner.scanTokens();
    });

    it("ignore comment line", () => {
      const { lexeme } = scanner.tokens[0];
      assert.strictEqual(lexeme, "print");
    });

    it("should update the line number", () => {
      const { line } = scanner.tokens[0];
      assert.strictEqual(line, 3);
    });

    it("should ignore inline comments", () => {
      assert.strictEqual(scanner.tokens.length, 3);
    });
  });

  describe("#Multi-line comments", () => {
    let scanner;

    before(async () => {
      scanner = await createScanner("multiLineComments.lox");
      scanner.scanTokens();
    });

    it("ignore comments", () => {
      const { type, lexeme, literal } = scanner.tokens[0];
      assert.strictEqual(type, TokenType.VAR);
      assert.strictEqual(lexeme, "var");
      assert.strictEqual(literal, null);
    });

    it("should update line number", () => {
      const { line } = scanner.tokens[0];
      assert.strictEqual(line, 5);
    });

    it("ignore inline comments", () => {
      const { type, lexeme, literal } = scanner.tokens[4];
      assert.strictEqual(type, TokenType.PRINT);
      assert.strictEqual(lexeme, "print");
      assert.strictEqual(literal, null);
    });

    it("inline comment should update line number", () => {
      const { line } = scanner.tokens[4];
      assert.strictEqual(line, 9);
    });
  });

  describe("#Keywords", () => {
    const keywords = {
      and: TokenType.AND,
      class: TokenType.CLASS,
      else: TokenType.ELSE,
      false: TokenType.FALSE,
      for: TokenType.FOR,
      fun: TokenType.FUN,
      if: TokenType.IF,
      nil: TokenType.NIL,
      or: TokenType.OR,
      print: TokenType.PRINT,
      return: TokenType.RETURN,
      super: TokenType.SUPER,
      this: TokenType.THIS,
      true: TokenType.TRUE,
      var: TokenType.VAR,
      while: TokenType.WHILE,
    };

    const typeToKeywords = Object.fromEntries(
      Object.entries(keywords).map(([keyword, type]) => [type, keyword])
    );

    let scanner;
    before(async () => {
      scanner = await createScanner("keywords.lox");
      scanner.scanTokens();
    });

    it("should recognize all keywords", () => {
      assert.strictEqual(
        scanner.tokens.length,
        Object.keys(keywords).length + 1
      );
    });

    it("correct type is stored", () => {
      for (let token of scanner.tokens) {
        const { lexeme, type } = token;

        if (type === TokenType.EOF) {
          return;
        }

        assert.strictEqual(type, keywords[lexeme]);
      }
    });

    it("correct lexeme is stored", () => {
      for (let token of scanner.tokens) {
        const { lexeme, type } = token;

        if (type === TokenType.EOF) {
          return;
        }

        assert.strictEqual(lexeme, typeToKeywords[type]);
      }
    });
  });

  describe("#Operators", () => {});

  describe("#Identifiers", () => {});

  describe("#Grouping", () => {});
});
