const { writeFile } = require("fs/promises");

class GenerateAst {
  constructor(args) {
    if (args.length != 1) {
      console.error("Usgae: generate_ast <output directory>");
      process.exit(64);
    }

    const outputDir = args[0];

    this.defineAst(outputDir, "Expr", {
      Binary: {
        fields: ["left", "operator", "right"],
        methods: [
          {
            name: "accept",
            override: true,
            body: "",
          },
        ],
      },
      Grouping: {
        fields: ["expression"],
        methods: [],
      },
      Literal: {
        fields: ["value"],
      },
      Unary: {
        fields: ["operator", "right"],
      },
    });
  }

  async defineAst(outputDir, baseClass, classes) {
    const source = `${this.defineClass(baseClass)}

${Object.entries(classes)
  .map(
    ([className, { fields }]) =>
      `exports.${className} = ` +
      this.defineClass(className, fields, baseClass, true)
  )
  .join("\n\n")}

exports.Visitor = ${this.defineVisitor(Object.keys(classes))}

exports.${baseClass} = ${baseClass};
  `;
    await writeFile(`${outputDir}/${baseClass.toLowerCase()}.js`, source);
  }

  defineClass(className, fields = [], parent = null, visitor = false) {
    const source = `class ${className} ${parent ? `extends ${parent}` : ""}{
  constructor(${fields.join(", ")}) {
    ${parent ? "super();" : ""}
    ${fields.map((field) => `this.${field} = ${field}`).join(";\n\t  ")}
  }

  ${`accept(visitor) {
    ${
      visitor
        ? `return visitor.visit${className}${parent}(this);`
        : 'throw new Error("Abstract accept method is not provided");'
    }
  }`}
}`;
    return source;
  }

  defineVisitor(classes) {
    return `class Visitor {
${classes
  .map(
    (className) => `  visit${className}Expr(expr) {
    throw new Error('Need to implement visit${className}Expr method');
  }`
  )
  .join("\n\n")}
}`;
  }
}

const generateAst = new GenerateAst(process.argv.splice(2));
