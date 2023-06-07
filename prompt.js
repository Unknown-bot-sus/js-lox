const readLine = require("readline/promises").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readLine.on("close", () => process.exit(0));

exports.prompt = async (query) => await readLine.question(query);
