const { Visitor } = require("./expr");

module.exports = class RPNPrinter {
  print(expr) {
    return expr.accept(this).split("").reverse().join("");
  }

  visitBinaryExpr(expr) {
    return this.grouping(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr) {
    return this.grouping("", expr.expression);
  }

  visitLiteralExpr(expr) {
    if (expr.value === null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr) {
    return this.grouping(expr.operator.lexeme, expr.right);
  }

  grouping(name, ...exprs) {
    const result = `${name} ${exprs
      .map((expr) => expr.accept(this))
      .reverse()
      .join(" ")}`;

    return result;
  }
};
