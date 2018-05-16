'use babel';

// Calculator is a simple calculator tool for Atom Console
// Calculator does not support bracketed expressions, e.g. 4*(2+3) #=> NaN,
// however it does support `ans`, e.g. 2+3 #=> 5, 4*ans #=> 20

/* Syntax:
  ans: answer of previous expression
  sqrt(x): square root of x
  log(x): natural logarithm of x
  log10(x): base 10 logarithm of x
  log2(x): base 2 logarithm of x
  logab(a, b): base a logarithm of b * Not working *
  sin(x): sine of x radians
  cos(x): cosine of x radians
  tan(x): tangent of x radians
  asin(x): arcsine of x radians
  acos(x): arccos of x radians
  atan(x): arctan of x radians
  sind(x): sine of x degrees
  cosd(x): cosine of x degrees
  tand(x): tangent of x degrees
  asind(x): arcsine of x degrees
  acosd(x): arccos of x degrees
  atand(x): arctan of x degrees
  round(x): x rounded to the nearest integer
  fact(x): factorial of x
*/

// Tokens
const NUMERIC = 0;
const PLUS = 1;
const MINUS = 2;
const MUL = 3;
const DIV = 4;
const AND = 5; // Bitwise AND
const OR = 6; // Bitwise OR
const XOR = 7; // Bitwise XOR
const NOT = 8; // Bitwise NOT
const POW = 9;
const EOF = -1;

class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }

  advance() {
    this.pos++;
    this.currentChar = this.text[this.pos]
  }

  peek() {
    return this.text[this.pos + 1];
  }

  skipWhiteSpace() {
    while (this.currentChar && this.currentChar.isWhitespace()) {
      this.advance();
    }
  }

  parseNumeric() {
    let num = '';
    while (this.currentChar && this.currentChar.isNumeric()) {
      num += this.currentChar;
      this.advance();
    }
    return parseFloat(num);
  }

  raiseError() {
    throw new SyntaxError("Syntax error!");
  }

  getNextToken() {
    while (this.currentChar) {
      let currentChar = this.currentChar;
      if (currentChar.isWhitespace()) {
        this.skipWhiteSpace();
        continue;
      }
      if (currentChar.isNumeric()) {
        return new Token(NUMERIC, this.parseNumeric());
      }

      // Special cases
      if (currentChar === '*' && this.peek() === '*') {
        this.advance();
        this.advance();
        return new Token(POW, '**');
      }

      switch (currentChar) {
        case '+':
          this.advance();
          return new Token(PLUS, '+');
          break;
        case '-':
          this.advance();
          return new Token(MINUS, '-');
          break;
        case '*':
          this.advance();
          return new Token(MUL, '*');
          break;
        case '/':
          this.advance();
          return new Token(DIV, '/');
          break;
        case '&':
          this.advance();
          return new Token(AND, '&');
          break;
        case '|':
          this.advance();
          return new Token(OR, '|');
          break;
        case '^':
          this.advance();
          return new Token(XOR, '^');
          break;
        case '~':
          this.advance();
          return new Token(NOT, '~');
          break;
      }

      this.raiseError();
    }
    return new Token(EOF, null);
  }

}

export default class Calculator {

  constructor() {
    this.isInteractive = true;
    this.prefix = "Calculator:  ";
    this.ans = 0;
  }

  init(text) {
    this.lexer = new Lexer(text);
    this.currentToken = this.lexer.getNextToken();
  }

  raiseError() {
    throw new SyntaxError("Error parsing input!");
  }

  // Parser
  eat(type) {
    if (this.currentToken.type == type) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.raiseError();
    }
  }

  factor() {
    let token = this.currentToken;
    this.eat(token.type);
    return token.value;
  }

  notFactor() {
    let result = this.factor();
    while (this.currentToken.type == NOT) {
      result = ~result;
    }
    return result;
  }

  powFactor() {
    let result = this.notFactor();
    if (this.currentToken.type == POW) {
      this.eat(POW);
      result = result ** this.notFactor();
    }
    return result;
  }

  mulFactor() {
    let result = this.powFactor();
    while ([MUL, DIV].includes(this.currentToken.type)) {
      let type = this.currentToken.type;
      if (type == MUL) {
        this.eat(MUL);
        result *= this.powFactor();
      } else if (type == DIV) {
        this.eat(DIV);
        result /= this.powFactor();
      }
    }
    return result;
  }

  sumFactor() {
    let result = this.mulFactor();
    while ([PLUS, MINUS].includes(this.currentToken.type)) {
      let type = this.currentToken.type;
      if (type == PLUS) {
        this.eat(PLUS);
        result += this.mulFactor();
      } else if (type == MINUS) {
        this.eat(MINUS);
        result -= this.mulFactor();
      }
    }
    return result;
  }

  andFactor() {
    let result = this.sumFactor();
    while (this.currentToken.type == AND) {
      result &= this.sumFactor();
    }
    return result;
  }

  xorFactor() {
    let result = this.andFactor();
    while (this.currentToken.type == XOR) {
      result ^= this.andFactor();
    }
    return result;
  }

  orFactor() {
    let result = this.xorFactor();
    while (this.currentToken.type == OR) {
      result |= this.xorFactor();
    }
    return result;
  }

  run(expr) {
    if (!expr) return 'Syntax error!';
    let returnString;
    try {
      this.init(expr);
      this.ans = this.orFactor();
      returnString = this.ans.toString();
    } catch (e) {
      if (e instanceof SyntaxError) {
        returnString = e.message;
      } else {
        throw e;
      }
    }
    return returnString;
  }

}

String.prototype.isNumeric = function() { return !isNaN(parseInt(this)) };
String.prototype.isWhitespace = function() { return /^\s+$/.test(this) };
