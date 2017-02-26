'use babel';

//'language-mode' command (e.g. python-mode)

let GRAMMARS = {};
if (atom && atom.grammars) {
  let gram = atom.grammars.getGrammars();
  if (gram)
    atom.grammars.getGrammars().forEach((grammar) => GRAMMARS[grammar.name.toLowerCase()] = grammar);
}

export default function languageMode(lang){
  this.hasArgs = true;
  if (arguments.length < 1) return;
  try {
    let initialGrammar, afterGrammar;
    let editor = atom.workspace.getActiveTextEditor();
    initialGrammar = editor.getGrammar();
    editor.setGrammar(GRAMMARS[lang.replace('-mode', '')]);
    afterGrammar = editor.getGrammar();
    if (initialGrammar.name != afterGrammar.name) {
      return true;
    } else {
      return false;
    }
  } catch(err) {
    if (typeof err == 'ReferenceError') {
      return false;
    } else {
      throw err;
    }
  }
}
