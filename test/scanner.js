const Scanner = require("../scanner");
const { readFile } = require("fs/promises");

async function test() {
  const filePath = "./test/scannerTest.lox";
  const source = await readFile(filePath, "utf-8");
  const scanner = new Scanner(source);

  scanner.scanTokens();

  console.log(scanner.tokens);
}

test();

console.log(Symbol("hello"));
