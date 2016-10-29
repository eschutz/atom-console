'use babel';

//'language-mode' command (e.g. python-mode)

let GRAMMARS = {};
atom.grammars.getGrammars().forEach((grammar) => GRAMMARS[grammar.name.toLowerCase()] = grammar);

export default function languageMode(lang){
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
