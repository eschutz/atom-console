'use babel';

export default function whatLine() {
    let pos = atom.workspace.getActiveTextEditor().getCursorBufferPosition();
    return [pos.row + 1, pos.column + 1].toString();
}
