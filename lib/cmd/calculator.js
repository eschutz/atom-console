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


export default class Calculator {

    constructor() {
        this.isInteractive = true;
        this.method = "calculate";
        this.prefix = "Calculator:  ";
        this.ans = null;
        const d2r = d => d*(Math.PI/180); // degrees to radians
        const r2d = r => r*(180/Math.PI); // radians to degrees

        // Factorial
        const fact = n => {
          let f = 1;
          for (let i = 2; i <= n; i++)
            f = f * i;
          return f;
        }

        this.wordExpressions = {
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
          sind   :(a)   =>  Math.sin(d2r(a)),
          cosd   :(a)   =>  Math.cos(d2r(a)),
          tand   :(a)   =>  Math.tan(d2r(a)),
          asind  :(a)   =>  r2d(Math.asin(a)),
          acosd  :(a)   =>  r2d(Math.acos(a)),
          atand  :(a)   =>  r2d(Math.atan(a)),
          round  :(a)   =>  Math.round(a),
          fact   :(a)   =>  fact(a)
        };
        this.SYNTAX = Object.assign({
          "+"    :(a,b) =>  a+b,
          "-"    :(a,b) =>  a-b,
          "*"    :(a,b) =>  a*b,
          "/"    :(a,b) =>  a/b,
          "%"    :(a,b) =>  a%b,
          "^"   :(a,b) =>  Math.pow(a,b),
        },
        this.wordExpressions);
    }


    calculate(expr) {
        let exprOperands;

        // Array of worded functions sorted by name length (longest - shortest)
        const calcFunctions = Object.keys(this.wordExpressions).sort((a, b) => {
            if (a.length > b.length)
                return -1;
            if (a.length < b.length)
                return 1;
            return 0;
        });

        const remove = (arr, item) => arr.splice(item, 1); // Remove item from array
        const compact = arr => { for (let i in arr) if (arr[i]==='') remove(arr, i) }; // Remove empty strings from array

        // Loop x times
        const times = x => f => {
          if (x > 0) {
            f();
            times(x - 1)(f);
          }
        };

        const RegEscape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regular expressions

        // Finds all the instances of a given string in an array
        const strFind = (arr, str) => {
            let outarr = [];
            arr.forEach((e, i) => {
              if (typeof e == 'string') {
              let strRegex = new RegExp(`^${RegEscape(str)}(?:\\(\\d+(?:\\.\\d+)?\\)|$)`); // RegExp looks for either `str` or `str(digit)`
                if (e.match(strRegex)) outarr.push(i);
            }
          });
            return outarr;
      }

        // Remove the operands on either side of a this.SYNTAX operator in an array
        const cleanUpOperands = (arr, n) => {
            let outarr = arr.slice(0);
            let i1 = n + 1; // To ensure the same item is referenced after an item is removed
            let i2 = n - 1;
            remove(outarr, i1);
            remove(outarr, i2);
            compact(outarr);
            return outarr;
        };

        // Evaluates each given operator expression in an array
        const evalOperations = (arr, operator) => {
          let outarr = arr.slice(0);
          // Loop for the number of times the operator appears, then change
            times(strFind(arr, operator).length)( () => {
                let index = strFind(outarr, operator)[0];
                outarr[index] = this.SYNTAX[operator](parseFloat(outarr[index - 1]), parseFloat(outarr[index + 1]));
                outarr = cleanUpOperands(outarr, index);
            });
            return outarr;
        }

        // Evaluates each function (string: 'func(x)') in an array with the bracketed `x` as an argument
        const evalFunction = (arr, func) => {
          let outarr = arr.slice(0);
          strFind(outarr, func).forEach(n => {
            outarr[n] = this.SYNTAX[func](arr[n].split(/\(|\)/)[1]);
          });
          return outarr;
        }

        // Clean up regular expressions, replace '**' with '^'
        const expLoop = () => {
            let restart;
            for (let exp in exprOperands) {
                let operand = exprOperands[exp];
                if (operand == "*" && exprOperands[exp - 1] == "*") {
                    exprOperands[exp - 1] = '^';
                    remove(exprOperands, exp);
                    restart = true;
                    break;
                }
            }
            if (restart) {
                restart = false;
                expLoop();
            }
        }

        if (!(expr.replace(new RegExp(calcFunctions.join('|')), '').match(/[^0-9+\-\*\^%\/\., \(\)]/))) { // Checks expression is valid
            // Splits the expression into an array
            exprOperands = expr.split(/((?<=[+\-\*\^, \/%])|(?=[+\-\*\^, \/%]))/);
            compact(exprOperands);

            expLoop(); // Cleans up exprOperands

            // Functions
            calcFunctions.forEach(f => exprOperands = evalFunction(exprOperands, f));

            // Operators
            ['^', '/', '*', '%', '+', '-'].forEach(op => exprOperands = evalOperations(exprOperands, op));

            this.ans = exprOperands[0];
            this.specialOutput = exprOperands.toString();

        } else {
            this.specialOutput = "Syntax error!";
        }
    }
}
