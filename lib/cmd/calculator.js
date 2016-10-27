'use babel';

export default class Calculator {

    constructor() {
        this.isInteractive = true;
        this.method = "calculate";
        this.prefix = "Calculator:  ";
        this.ans = null;
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
          round  :(a)   =>  Math.round(a)
        };
        this.SYNTAX = Object.assign({
          "+"    :(a,b) =>  a+b,
          "-"    :(a,b) =>  a-b,
          "*"    :(a,b) =>  a*b,
          "/"    :(a,b) =>  a/b,
          "%"    :(a,b) =>  a%b,
          "**"   :(a,b) =>  Math.pow(a,b),
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
        const compact = arr => {
            for (let i of arr)
                if (!i) remove(arr, i)
        }; // Remove falsy values from array

        // Finds all the instances of a given string in an array
        const strFind = (arr, str) => {
            let outarr = [];
            arr.forEach((e, i) => {
                if (e == str) outarr.push(i)
            });
            return outarr;
        };

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

        // Clean up regular expression inaccuracies
        const expLoop = () => {
            let restart;
            for (let exp in exprOperands) {
                let operand = exprOperands[exp];
                if (operand == "*" && exprOperands[exp - 1] == "*") {
                    exprOperands[exp - 1] = '**';
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


        if (!(expr.replace(/ans|sin|cos|tan|asin|acos|atan|log|log10|log2|logab|round|sqrt/, '').match(/[^0-9+\-*%\/\.\(\)]/))) { // Checks expression is valid
            // Splits the expression into an array
            exprOperands = expr.split(/((?<=[+\-\*\/%])|(?=[+\-\*\/%]))/);
            compact(exprOperands);

            expLoop(); // Cleans up exprOperands

            // Brackets not yet implemented
            console.log(exprOperands);
            // Functions

            // Exponents
            evalOperations(exprOperands, '**');
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
            this.specialOutput = exprOperands.toString();

        } else {
            this.specialOutput = "Syntax error!";
        }
    }
}
