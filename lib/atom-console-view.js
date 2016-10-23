'use babel';

import {
    TextEditorView
} from 'atom-space-pen-views';
import CommandHandler from './command';
//import languageMode from './lang-mode';

export default class AtomConsoleView {

    commandNotFound: null;
    commandReset: null;
    commandHandler: null;

    constructor(serializedState) {
        // Create panel element

        this.panel = document.createElement('div');
        this.panel.classList.add('atom-console');

        // Create console wrapper element
        const consoleElementsWrapper = document.createElement('div');
        consoleElementsWrapper.classList.add('console-wrapper');
        this.panel.appendChild(consoleElementsWrapper);

        const consoleIcon = document.createElement('span');
        consoleIcon.classList.add('icon', 'icon-terminal', 'custom-term-icon');
        consoleElementsWrapper.appendChild(consoleIcon);

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

        this.commandHandler = new CommandHandler();

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
        let contents = this._console.getText();

        if (this.commandReset) {
            this._console.setText('');
            this.commandReset = false;
            return
        }

        commandOutput = this.commandHandler.executeConsoleCommand(contents)
        if (typeof commandOutput == 'object' && typeof commandOutput.isInteractive != 'undefined') {
          this._console.setText('');
          return
        };


        // This is currently a quite messy way to wait for async code that takes
        // awhile to execute
        if (this.commandHandler.toolIsRunning && this.commandHandler.currentTool.networkTool) {
            let timeout = 0;
            let networkCommand = setInterval(function(commandHandler, atomConsole) {
                timeout++;
                if (typeof commandHandler.currentTool.output != 'undefined') {
                  atomConsole._console.setText(commandHandler.currentTool.output);
                  atomConsole.commandReset = true;
                  commandHandler.stopTool();
                    clearInterval(networkCommand);
                };
                if (timeout == 100) { // 10 second timeout
                  timeout = 0;
                    atomConsole._console.setText("Network timed out. Try again later.")
                    atomConsole.commandReset = true;
                    clearInterval(networkCommand);
                };
            }, 100, this.commandHandler, this); // Checks ten times per second if the network request has completed

        } else if (this.commandHandler.specialOutput) {
            this._console.setText(commandOutput);
            this.commandReset = true;
        } else if (!commandOutput) {
            this._console.setText(`${contents}[No Match]`);
            this.commandReset = true;
        } else {
            this._console.setText('');
            this.commandReset = false;
        }

    }

}
