'use babel';

export default class Calculator {

  constructor() {
    this.isInteractive = true;
    this.method = "calculate";
    this.prefix = "Calculator:  ";
    this.ans;
    this.SYNTAX = {
      "+"    :(a,b) =>  a+b,
      "-"    :(a,b) =>  a-b,
      "*"    :(a,b) =>  a*b,
      "/"    :(a,b) =>  a/b,
      "%"    :(a,b) =>  a%b,
      "**"   :(a,b) =>  Math.pow(a,b),
      ans    :()    =>  this.ans,
      sqrt   :(a)   =>  Math.sqrt(a),
      log    :(a)   =>  Math.log(a),
      log10  :(a)   =>  Math.log10(a),
      log2   :(a)   =>  Math.log2(a),
      logab  :(a,b) =>  Math.log(b)/Math.log(a),
      sin    :(a)   =>  Math.sin(a),
      cos    :(a)   =>  Math.cos(a),
      tan    :(a)   =>  Math.tan(a),
      asin   :(a)   =>  Math.asin(a),
      acos   :(a)   =>  Math.acos(a),
      atan   :(a)   =>  Math.atan(a),
      round  :(a)   =>  Math.round(a)
    }
  }

  calculate(expr) {
    // Checks expression is valid
    if (!(expr.replace(/ans|sin|cos|tan|asin|acos|atan|log|log10|log2|logab|round|sqrt/, '').match(/[^0-9+\-*\/\.()]/)) {
      exprOperands = expr.split(/([^0-9+\-*\/\.()])/);
  } else {
    this.specialOutput = "Syntax error";
  }
  }
}
