'use babel';

export default class GoToLine {
  constructor() {
    this.isInteractive = true;
    this.prefix = "Go To Line:  ";
    this.clearConsoleAfterSubmit = true;
  }

  run(line) {
    try {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([line - 1, 0]);
    return true;
  } catch(err) {
    return false;
  }
  }
}
