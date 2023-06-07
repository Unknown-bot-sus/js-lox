const { prompt } = require("./prompt.js");
const { readFile } = require("fs/promises");

module.exports = class Lox {
  main(args) {
    if (args.length > 1) {
      console.log("Usage: lox [script]");
      process.exit(64);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runRepl();
    }
  }

  async runFile(filePath) {
    try {
      const code = await readFile(filePath, "utf-8");
      run(code);

      if (this.hadError) process.exit(65);
    } catch (e) {
      console.error(e);
    }
  }

  async runRepl() {
    while (true) {
      const line = await prompt("> ");
      if (input == "") {
        process.exit(0);
      }

      run(line);

      this.hadError = false;
    }
  }

  run(source) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (let token of tokens) {
      console.log(token);
    }
  }

  static error(line, message) {
    report(line, "", message);
  }

  report(line, where, message) {
    console.log(`[line ${line}] Error ${where}: ${message}`);

    this.hadError = true;
  }
};
