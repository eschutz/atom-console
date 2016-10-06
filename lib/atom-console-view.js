'use babel';

import {
    TextEditorView
} from 'atom-space-pen-views';

export default class AtomConsoleView {

    commandNotFound: null;
    commandReset: null;

    constructor(serializedState) {
        // Create panel element

        this.panel = document.createElement('div');
        this.panel.classList.add('atom-console');

        // Create console wrapper element
        const consoleElementsWrapper = document.createElement('div');
        consoleElementsWrapper.classList.add('console-wrapper');
        this.panel.appendChild(consoleElementsWrapper);

        // Create console prefix element
        const consolePrefix = document.createElement('div');
        consolePrefix.classList.add('console-prefix');
        consolePrefix.textContent = 'atom-console:  ';
        consoleElementsWrapper.appendChild(consolePrefix);

        // Create the console input
        this._console = new TextEditorView({
            mini: true
        });
        consoleModel = this._console.getModel(); //this.panel.style.height);
        consoleModelTag = atom.views.getView(consoleModel);
        consoleModelTag.classList.add('console');
        consoleElementsWrapper.appendChild(consoleModelTag);

    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.panel.remove();
    }

    getElement() {
        return this.panel;
    }

    sendCommand() {
        let contents = this._console.getText()
        if (this.commandReset) {
            this._console.setText('');
            this.commandReset = false;
            return
        }

        if (Object.keys(atom.commands.registeredCommands).includes(contents)) {
            executeCommand(contents)
            this._console.setText('');
        } else {
            this.commandNotFound = true;
            this.commandReset = false;
        }

        if (this.commandNotFound) {
            this._console.setText(`${contents}[No Match]`);
            this.commandNotFound = false;
            this.commandReset = true;
        }

        // This code would not work without a-laughlin's comment
        // in Atom's Github Issues section: https://github.com/atom/atom/issues/5564
        function executeCommand(_event, target = atom.views.getView(atom.workspace.getActivePane().getActiveEditor())) {
          atom.commands.dispatch(target, _event);
        }

    }

}
