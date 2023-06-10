class Expr {
  constructor() {
    
    
  }

  accept(visitor) {
    throw new Error("Abstract accept method is not provided");
  }
}

exports.Binary = class Binary extends Expr{
  constructor(left, operator, right) {
    super();
    this.left = left;
	  this.operator = operator;
	  this.right = right
  }

  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

exports.Grouping = class Grouping extends Expr{
  constructor(expression) {
    super();
    this.expression = expression
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

exports.Literal = class Literal extends Expr{
  constructor(value) {
    super();
    this.value = value
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

exports.Unary = class Unary extends Expr{
  constructor(operator, right) {
    super();
    this.operator = operator;
	  this.right = right
  }

  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

exports.Visitor = class Visitor {
  visitBinaryExpr(expr) {
    throw new Error('Need to implement visitBinaryExpr method');
  }

  visitGroupingExpr(expr) {
    throw new Error('Need to implement visitGroupingExpr method');
  }

  visitLiteralExpr(expr) {
    throw new Error('Need to implement visitLiteralExpr method');
  }

  visitUnaryExpr(expr) {
    throw new Error('Need to implement visitUnaryExpr method');
  }
}

exports.Expr = Expr;
  