'use babel';

import AtomConsoleView from './atom-console-view';
import {
    CompositeDisposable
} from 'atom';
import fs from 'fs';

export default {

    activate(state) {
        this.atomConsoleView = new AtomConsoleView(state.atomConsoleViewState);
        this.atomConsoleWrapper = atom.workspace.addBottomPanel({
            item: this.atomConsoleView.getElement()
        });
        this.consoleHeight = parseInt(getComputedStyle(this.atomConsoleWrapper.getItem()).getPropertyValue("height").replace("px", ""));

        this.atomConsoleVisible = false;

        // Adjustment for spec reading null off the querySelector
        let bottomBorder = document.querySelector('atom-panel.bottom.tool-panel.panel-bottom');
        if (bottomBorder) document.querySelector('atom-panel.bottom.tool-panel.panel-bottom').style.borderBottom = "none";

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-console:toggle': () => this.toggle(),
            'atom-console:send-command': () => this.atomConsoleView.sendCommand(),
            'atom-console:stop-tool': () => this.atomConsoleView.commandHandler.stopTool(),
            'atom-console:focus': () => document.querySelector('atom-text-editor[mini].console').focus(),
            'atom-console:help': () => this.atomConsoleView.sendCommand(),
            'atom-console:get-prev-command': () => this.atomConsoleView.getPrevCommand(),
            'atom-console:get-next-command': () => this.atomConsoleView.getNextCommand(),
            'atom-console:autocomplete': () => this.atomConsoleView.autocompleteInput()
        }));

        // Adjustment for spec reading null off the querySelector
        let consoleCursor = document.querySelector('atom-text-editor[mini].console .cursors .cursor');
        this.initialCursorHeight = consoleCursor ? parseInt(consoleCursor.style.height.replace("px", "")) : 15;
        this.consoleCursorHeight = this.initialCursorHeight - this.initialCursorHeight / 4;

    },

    deactivate() {
        this.atomConsoleWrapper.destroy();
        this.subscriptions.dispose();
        this.atomConsoleView.destroy();
    },

    serialize() {
        return {
            atomConsoleViewState: this.atomConsoleView.serialize()
        };
    },

    toggle() {
        if (this.atomConsoleVisible) {
            this.atomConsoleVisible = this.atomConsoleView.console_animate_out(this.atomConsoleWrapper, this.consoleHeight);
            atom.views.getView(atom.workspace).focus();
        } else {
            this.atomConsoleVisible = this.atomConsoleView.console_animate_in(this.atomConsoleWrapper, this.consoleHeight);

            // Adjustment for spec reading null off the querySelector
            const cursor = document.querySelector('atom-text-editor[mini].console .cursors .cursor');
            if (cursor) {
                cursor.setAttribute('style', cursor.getAttribute('style').replace(`height: ${this.initialCursorHeight}px`, `height: ${this.consoleCursorHeight}px`));
            };
            // Adjustment for spec reading null off the querySelector
            const editor = document.querySelector('atom-text-editor[mini].console');
            if (editor) {
                editor.focus();
            };
        }
    }

};
