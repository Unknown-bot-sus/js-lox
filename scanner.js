const Token = require("./token");
const TokenType = require("./tokenType");
const Lox = require("./jslox");

module.exports = class Scanner {
  keywords = {
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

  constructor(source) {
    this.source = source;
    this.tokens = [];

    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));

    return this.tokens;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      // operators
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        break;

      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.error(line, "Unexpected character");
        }
    }
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    return this.source[this.current++];
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;
    ++this.current;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return "\n";

    return this.source[this.current];
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return "\n";

    return this.source[current + 1];
  }

  addToken(type, literal = null) {
    const text = this.source.slice(this.start, this.current);

    this.tokens.push(new Token(type, text, literal, this.line));
  }

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(line, "Unterminated string.");
      return;
    }

    this.advance();

    const literal = this.source.slice(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, literal);
  }

  isDigit(char) {
    return char >= "0" && char <= "9";
  }

  number() {
    this.consumeDigits();
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      this.consumeDigits();
    }

    this.addToken(
      TokenType.NUMBER,
      Number(this.source.slice(this.start, this.current))
    );
  }

  consumeDigits() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.slice(this.start, this.current);
    let type = this.keywords[text];
    if (type === undefined) {
      type = TokenType.IDENTIFIER;
    }

    this.addToken(type);
  }

  isAlpha(char) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char == "_"
    );
  }

  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }
};
