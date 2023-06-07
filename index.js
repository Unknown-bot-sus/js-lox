const Lox = require("./jslox.js");

const lox = new Lox();

const args = process.argv.splice(2);

lox.main(args);
