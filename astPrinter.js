const { Visitor } = require("./expr");

module.exports = class AstPrinter extends Visitor {
  print(expr) {
    return expr.accept(this);
  }

  visitBinaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr) {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr) {
    if (expr.value === null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  parenthesize(name, ...exprs) {
    const result = `(${name} ${exprs
      .map((expr) => expr.accept(this))
      .join(" ")})`;
    return result;
  }
};
