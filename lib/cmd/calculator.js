'use babel';

export default class Calculator {

    constructor() {
        this.isInteractive = true;
        this.method = "calculate";
        this.prefix = "Calculator:  ";
        this.ans = null;
        const d2r = d => d*(180/Math.PI); // degrees to radians
        const r2d = r => (180/Math.PI)/r; // radians to degrees
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
          round  :(a)   =>  Math.round(a),
          /*
          sind   :(a)   =>  Math.sin(d2r(a)),
          cosd   :(a)   =>  Math.cos(d2r(a)),
          tand   :(a)   =>  Math.tan(d2r(a)),
          asind  :(a)   =>  r2d(Math.asin(a)),
          acosd  :(a)   =>  r2d(Math.acos(a)),
          atand  :(a)   =>  r2d(Math.atan(a)),
          */
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
        let exprOperands, openParen, closeParen, evalOrder = {
            b: [],
            e: [],
            d: [],
            m: [],
            a: [],
            s: []
        };

        const calcFunctions = Object.keys(this.wordExpressions);

        const remove = (arr, item) => arr.splice(arr.indexOf(item), 1); // Remove item from array
        const compact = arr => { for (let i of arr) if (i==='') remove(arr, i) }; // Remove empty strings from array

        const RegEscape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regular expressions

        // Finds all the instances of a given string in an array
        const strFind = (arr, str) => {
            let outarr = [];
            arr.forEach((e, i) => {
              if (typeof e == 'string') {
              let strRegex = new RegExp(`^${RegEscape(str)}(?:\\(\\d+\\)|$)`); // RegExp looks for either `str` or `str(digit)`
                if (e.match(strRegex)) outarr.push(i);
            }
          });
            return outarr;
      }
        // Remove the operands on either side of a this.SYNTAX operator in an array
        const cleanUpOperands = (arr, n) => {
            i1 = arr[n - 1]; // To ensure the same item is referenced after an item is removed
            i2 = arr[n + 1];
            remove(arr, i1);
            remove(arr, i2);
            compact(arr);
        };

        // Evaluates each given operator expression in an array
        const evalOperations = (arr, operator) => {
            strFind(arr, operator).forEach(n => {
                arr[n] = this.SYNTAX[operator](parseFloat(arr[n - 1]), parseFloat(arr[n + 1]));
                cleanUpOperands(arr, n);
            });
        }

        const evalFunction = (arr, func) => {
          strFind(arr, func).forEach(n => {
            arr[n] = this.SYNTAX[func](arr[n].split(/\(|\)/)[1]);
          });
        }

        // Clean up regular expression inaccuracies
        const expLoop = () => {
            let restart;
            for (let exp in exprOperands) {
                let operand = exprOperands[exp];
                if (operand == "*" && exprOperands[exp - 1] == "*") {
                    exprOperands[exp - 1] = '^';
                    remove(exprOperands, operand);
                    restart = true;
                    break;
                }
            }
            if (restart) {
                restart = false;
                expLoop();
            }
        }

        if (!(expr.replace(new RegExp(calcFunctions.join('|')), '').match(/[^0-9+\-\*\^%\/\.\(\)]/))) { // Checks expression is valid
            // Splits the expression into an array
            exprOperands = expr.split(/((?<=[+\-\*\^\/%])|(?=[+\-\*\^\/%]))/);
            compact(exprOperands);

            expLoop(); // Cleans up exprOperands

            // Brackets not yet implemented
            console.log(exprOperands);
            // Functions

            calcFunctions.forEach(f => {
              evalFunction(exprOperands, f);
            });

            console.log(exprOperands);
            // Exponents
            evalOperations(exprOperands, '^');
            console.log(exprOperands);
            // Division
            evalOperations(exprOperands, '/');
            console.log(exprOperands);
            // Multiplication
            evalOperations(exprOperands, '*');
            console.log(exprOperands);
            // (Modulo)
            evalOperations(exprOperands, '%');
            console.log(exprOperands);
            // Addition
            evalOperations(exprOperands, '+');
            console.log(exprOperands);
            // Subtraction
            evalOperations(exprOperands, '-');

            console.log(exprOperands);
            this.ans = exprOperands[0];
            this.specialOutput = exprOperands.toString();

        } else {
            this.specialOutput = "Syntax error!";
        }
    }
}
