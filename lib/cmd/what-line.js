'use babel';

export default function whatLine() {
  if (!(arguments.length == 0)) {
    return false;
  } else {
    let pos = atom.workspace.getActiveTextEditor().getCursorBufferPosition();
    return [pos.row + 1, pos.column + 1].toString();
  }
}
