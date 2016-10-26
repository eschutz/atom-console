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
    animateSpeed: null;

    constructor(serializedState) {
        // Create panel element

        this.panel = document.createElement('div');
        this.panel.classList.add('atom-console');

        // Create console wrapper element
        const consoleElementsWrapper = document.createElement('div');
        consoleElementsWrapper.classList.add('console-wrapper');
        this.panel.appendChild(consoleElementsWrapper);

        const consoleIcon = document.createElement('span');
        consoleIcon.classList.add('icon', 'icon-terminal', 'custom-console-icon');
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

        this.dLSymbol = document.createElement('span');
        this.dLSymbol.classList.add('icon', 'icon-arrow-down', 'custom-console-icon', 'load-icon-wrapper', 'down-arrow');
        this.loadSymbol = document.createElement('span');
        this.loadSymbol.classList.add('icon-sync', 'custom-console-icon', 'load-icon-wrapper', 'load-icon');
        this.dLSymbol.style.visibility = "hidden";
        this.loadSymbol.style.visibility = "hidden";
        consoleElementsWrapper.appendChild(this.loadSymbol);
        consoleElementsWrapper.appendChild(this.dLSymbol);

        this.animateSpeed = 3;

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

    console_animate_in(wrapper, height) {
        let atom_console = wrapper.getItem();
        let pos = 0;
        let id = setInterval(frame, this.animateSpeed);

        function frame() {
            if (pos == height) {
                clearInterval(id);
            } else {
                pos++;
                atom_console.style.height = pos + 'px';
            }
        }
        return true;
    }

    console_animate_out(wrapper, height) {
        let atom_console = wrapper.getItem();
        let pos = height;
        let id = setInterval(frame, this.animateSpeed);

        function frame() {
            if (pos == 0) {
                clearInterval(id);
            } else {
                pos--;
                atom_console.style.height = pos + 'px';
            }

        }
        return false;
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
            this.dLSymbol.style.visibility = "visible";
            this.loadSymbol.style.visibility = "visible";
            let timeout = 0;
            let networkCommand = setInterval(function(atomConsole) {

                function sendOutput(out) {
                    timeout = 0;
                    atomConsole._console.setText(out);
                    atomConsole.commandReset = true;
                    atomConsole.dLSymbol.style.visibility = "hidden";
                    atomConsole.loadSymbol.style.visibility = "hidden";
                    clearInterval(networkCommand);
                }

                timeout++;
                atomConsole.loadSymbol.style.transform = `rotate(${timeout*18}deg)`; // Rotates the downloading symbol

                let output = atomConsole.commandHandler.currentTool.output;

                if (typeof output != 'undefined') {
                    if (!output.includes("No Match")) {
                        atomConsole.commandHandler.stopTool();
                    }
                    sendOutput(output);
                };
                if (timeout == 100) { // 10 second timeout

                    sendOutput("Network timed out. Try again later.");

                };
            }, 100, this); // Checks ten times per second if the network request has completed


        } else if (this.commandHandler.specialOutput) {
            this._console.setText(commandOutput);
            this.commandReset = true;
      } else if (this.commandHandler.currentTool && !this.commandHandler.currentTool.specialOutput) { // Current workaround as the command-search errors when returning values – likely a bug in Atom
            this._console.setText(`${contents}[No Match]`);
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
