'use babel';

//'language-mode' command (e.g. python-mode)

export default function languageMode(lang){
  try {
    return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane().getActiveEditor()), `set-syntax-emacs:${lang}`);
  } catch(err) {
    if (typeof err == 'ReferenceError') {
      return false;
    }
  }
}
