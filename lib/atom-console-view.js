'use babel';

import fs from 'fs';
import CommandHandler from './command';
import autocomplete from './autocomplete';

class ConsoleTextEditorView {

  getModel() {
    return this.textEditor.getModel()
  }

  constructor(options = {}) {
    this.textEditor = document.createElement('atom-text-editor')
    if (Object.keys(options).includes('mini')) {this.textEditor.setAttribute('mini', options['mini'])}
    this.model = this.getModel()
    if (Object.keys(options).includes('autoHeight')) {this.model.autoHeight = options['autoHeight']}
  }

  setModel(model) {
    return this.textEditor.setModel(model)
  }

  setText(text) {
    return this.model.setText(text)
  }

  getText() {
    return this.model.getText()
  }

  hasFocus() {
    return this.model.hasFocus()
  }
}

export default class AtomConsoleView {

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
        this._console = new ConsoleTextEditorView({
          mini: true,
          autoHeight: false
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
        this.historyIndex = 0;

        this.commandHandler = new CommandHandler();

        this.clearCache = () => {
          let cacheDir = `${process.env['ATOM_HOME']}/packages/atom-console/lib/tmp`;
          fs.readdir(cacheDir, (err, files) => {
            if (files) {
              files.forEach(file => {
                fs.unlink(`${cacheDir}/${file}`, (err) => {
                  if (err) {
                    throw err;
                  }
                });
              });
            }
          });
        }

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
        this.commandHandler.destroy();
        this.clearCache();
        return false;
    }

    getPrevCommand() {
        if (this.commandHandler.history.length == 0)
            return;

        if (this.historyIndex == 0 && !this.historyQueried)
            this.originalText = this._console.getText();

        this.historyQueried = true;
        this._console.setText(this.commandHandler.history[this.historyIndex]);
        if (this.historyIndex < this.commandHandler.history.length - 1)
            this.historyIndex++;
    }

    getNextCommand() {
        if (this.commandHandler.history.length == 0)
            return;

        if (this.historyIndex == 0)
            return this._console.setText(this.originalText);

        if (this.historyIndex > 0)
            this.historyIndex--;
        this._console.setText(this.commandHandler.history[this.historyIndex]);
    }

    autocompleteInput() {
      let text = this._console.getText();
      let complete = autocomplete(text);
      this._console.setText(complete);
    }

    sendCommand() {
        let contents = this._console.getText();

        this.historyIndex = 0;
        this.historyQueried = false;

        if (this.commandReset) {
            this._console.setText('');
            this.commandReset = false;
            return;
        }

        commandOutput = this.commandHandler.executeConsoleCommand(contents)
        if (typeof commandOutput == 'object' && typeof commandOutput.isInteractive != 'undefined') {
            this._console.setText('');
            return;
        }


        // This is currently a quite messy way to wait for async code that takes
        // awhile to execute

        if (this.commandHandler.toolIsRunning && this.commandHandler.currentTool.async) {
            this.dLSymbol.style.visibility = "visible";
            this.loadSymbol.style.visibility = "visible";
            let timeout = 0;
            let networkCommand = setInterval(atomConsole => {

                let sendOutput = out => {
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

                if (output != null) {
                    if (!output.includes("No Match")) {
                        atomConsole.commandHandler.stopTool();
                    }
                    sendOutput(output);
                }
                if (timeout == 300) { // 30 second timeout – This doesn't actually stop execution, just stops the console so other tasks can be performed.

                    sendOutput("Network timed out. Try again later.");

                }
            }, 100, this); // Checks ten times per second if the network request has completed
            return;
        }


        let text = `${contents}[No Match]`;
        let cmdReset = true;

        if (this.commandHandler.toolIsRunning && this.commandHandler.currentTool.clearConsoleAfterSubmit) {
            text = '';
            cmdReset = false;

        } else {
            if (typeof commandOutput == 'string') {
                text = commandOutput;
            } else if (commandOutput === true) {
              text = '';
              cmdReset = false;
            }
        }
        this._console.setText(text);
        this.commandReset = cmdReset;
    }

}
