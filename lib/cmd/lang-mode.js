'use babel';

// 'language-mode' command (e.g. python-mode)

let GRAMMARS = {};
atom.grammars.getGrammars().forEach((grammar) => { if (grammar.name) GRAMMARS[grammar.name.toLowerCase()] = grammar; })

export default function languageMode(lang){
  this.hasArgs = true;
  if (arguments.length < 1) return;
  try {
    let initialGrammar, afterGrammar, language;
    let editor = atom.workspace.getActiveTextEditor();

    if (!editor) return false;

    initialGrammar = editor.getGrammar();
    language = lang.replace('-mode', '');
    if (initialGrammar.name && initialGrammar.name.toLowerCase() == language) return true;
    editor.setGrammar(GRAMMARS[language]);
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
