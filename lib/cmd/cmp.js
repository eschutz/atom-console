'use babel';

const exec = require('child_process').exec;

// cmp is a compilation tool for atom-console,
// that compiles the currently open file as an
// executable with the same name

// Compiler helper class
// Constructor takes an object where:
//    name: compiler name
//    options: compiler options to be passed on execution (e.g. -abcdEFGH)
//    format: (optional) format string for arguments, must include "inputName"
//         and "outputName" (default: "inputName outputName")
//    extensions: an array of possible file extensions processable by this compiler

class Compiler {
  constructor(attrs) {
    if (!arguments.length || !(attrs.name && (typeof(attrs.options) === "string") && attrs.extensions)) throw 'ArgumentError: missing arguments in Compiler declaration';
    this.name = attrs.name;
    this.options = attrs.options;
    this.extensions = attrs.extensions;
    this.fmt = attrs.format || "outputName inputName";
  }

  // Format returns a formatted compilation command
  // Takes arguments:
  //    ioStrings: an object containing outputName and inputName strings to be
  //               replaced as arguments
  //    _args: an array containing any extra arguments that can be given to the
  //          compiler in any order

  format(ioStrings, _args) {
    let args = _args || [];
    let fmt = this.fmt;
    let compilerArgs = fmt.replace("outputName", ioStrings.outputName).replace("inputName", ioStrings.inputName) + " " + args.join(" ")
    return `${this.name} ${this.options} ${compilerArgs}`;
  }

}

// CHANGE COMPILER EXECUTABLES AND OPTIONS HERE
const C = new Compiler({
  name: 'gcc',
  options: '-o',
  extensions: ['c', 'h', 'm']
});
const CXX = new Compiler({
  name: 'g++',
  options: '-o',
  extensions: ['cc', 'cpp', 'cxx', 'c++', 'hh', 'hpp', 'hxx', 'h++', 'mm']
});
const JAVA = new Compiler({
  name: 'javac',
  options: '-cp .',
  format: 'inputName',
  extensions: ['java']
});
const SWIFT = new Compiler({
  name: 'swiftc',
  options: '-o',
  extensions: ['swift']
});
const GO = new Compiler({
  name: 'go tool compile',
  options: '-o',
  extensions: ['go']
});
const RUST = new Compiler({
  name: 'rustc',
  options:'-o',
  extensions: ['rs', 'rlib']
});
const SCALA = new Compiler({
  name: 'scalac',
  options: '',
  format: 'inputName',
  extensions: ['scala', 'sc']
});
const HASKELL = new Compiler({
  name: 'ghc',
  options: '--make',
  extensions: ['hs', 'lhs']
});
const LUA = new Compiler({
  name: 'luac',
  options: '-o',
  extensions: ['lua']
});
const PASCAL = new Compiler({
  name: 'fpc',
  options: '',
  format: 'inputName',
  extensions: ['pp', 'pas', 'inc']
});

// ADD YOUR OWN COMPILER CONSTANTS AND ADD THEM TO THE OBJECT BELOW

const COMPILERS = [
  C,
  CXX,
  JAVA,
  SWIFT,
  GO,
  RUST,
  SCALA,
  HASKELL,
  LUA,
  PASCAL
]

export default function compile() {
  let file = atom.workspace.getActiveTextEditor().getBuffer().file.path;
  // Replaces string until last dot (.), to get the file extension
  let fileExtension = file.replace(/^.*\.(?!.*\.)/, '');
  let compiler;
  for (comp of COMPILERS) {
    if (comp.extensions.includes(fileExtension)) {
      compiler = comp;
      break;
    }
  }
  if (!compiler) return `No ${atom.workspace.getActiveTextEditor().getGrammar().name} compiler available!`;
  let compiledFileName = file.replace(`.${fileExtension}`, '');
  let _shell = (process.platform == 'win32') ? 'cmd.exe':'/bin/bash';
  exec(compiler.format({inputName: file, outputName: compiledFileName}), {cwd:process.env.HOME, env:process.env, shell:_shell},
    (err, stdout, stderr) => {
      if (err || stderr) {
        atom.notifications.addError(`Compilation of \`${file}\` produced errors:`, {description: `Message: \`${err||stderr}\``, dismissable: true});
        return false;
      } else if (stdout) {
        atom.notifications.addWarning(`Compilation of \`${file}\` generated warning(s):`, {description: `\`${stdout}\``});
      } else {
        atom.notifications.addSuccess(`Compilation of \`${file}\` successful.`);
      }
    });
  return true;
}
